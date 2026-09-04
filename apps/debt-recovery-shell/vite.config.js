import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { randomBytes } from 'node:crypto';
import { generateRuntimeConfig } from './scripts/generate-config.js';

const requireFromShell = createRequire(import.meta.url);
const requireFromRoot = createRequire(path.resolve(__dirname, '../../package.json'));

function findPackageRootFromResolvedEntry(resolvedEntry, specifier) {
	let currentDir = path.dirname(resolvedEntry);
	const fsRoot = path.parse(currentDir).root;

	while (currentDir && currentDir !== fsRoot) {
		const pkgJsonPath = path.join(currentDir, 'package.json');
		if (existsSync(pkgJsonPath)) {
			try {
				const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
				if (pkgJson?.name === specifier) {
					return currentDir;
				}
			} catch {
				// Keep walking up if a package.json exists but cannot be parsed.
			}
		}

		const parentDir = path.dirname(currentDir);
		if (parentDir === currentDir) break;
		currentDir = parentDir;
	}

	return null;
}

/** Prefer shell `package.json` deps; fall back to monorepo root for packages only declared on the root workspace. */
function tryResolvePackageDir(specifier) {
	const resolvers = [requireFromShell, requireFromRoot];
	for (const req of resolvers) {
		try {
			return path.dirname(req.resolve(path.join(specifier, 'package.json')));
		} catch {
			try {
				const resolvedEntry = req.resolve(specifier);
				const rootDir = findPackageRootFromResolvedEntry(resolvedEntry, specifier);
				if (rootDir) {
					return rootDir;
				}
			} catch {
				/* try next resolver */
			}
		}
	}
	return null;
}

function resolvePackageDir(specifier) {
	const resolvedDir = tryResolvePackageDir(specifier);
	if (!resolvedDir) {
		throw new Error(`[vite.config.js] Could not resolve package: ${specifier}`);
	}

	return resolvedDir;
}

// Add a dedicated function to resolve react-is properly
function resolveReactIs() {
	try {
		// Try to resolve react-is from shell first
		const reactIsPath = requireFromShell.resolve('react-is');
		return path.dirname(reactIsPath);
	} catch {
		try {
			// Fallback to root
			const reactIsPath = requireFromRoot.resolve('react-is');
			return path.dirname(reactIsPath);
		} catch {
			// If not found, try to find it in node_modules
			const possiblePath = path.resolve(__dirname, '../../node_modules/react-is');
			if (requireFromShell.resolve(possiblePath)) {
				return possiblePath;
			}
			throw new Error('Could not resolve react-is');
		}
	}
}

const vendorAliases = {};

const muiMaterialDir = tryResolvePackageDir('@mui/material');
if (muiMaterialDir) vendorAliases['@mui/material'] = path.join(muiMaterialDir, 'esm');

const muiIconsDir = tryResolvePackageDir('@mui/icons-material');
if (muiIconsDir) vendorAliases['@mui/icons-material'] = path.join(muiIconsDir, 'esm');

const muiSystemDir = tryResolvePackageDir('@mui/system');
if (muiSystemDir) vendorAliases['@mui/system'] = path.join(muiSystemDir, 'esm');

const emotionReactDir = tryResolvePackageDir('@emotion/react');
if (emotionReactDir) vendorAliases['@emotion/react'] = emotionReactDir;

const emotionStyledDir = tryResolvePackageDir('@emotion/styled');
if (emotionStyledDir) vendorAliases['@emotion/styled'] = emotionStyledDir;

const muiDatePickersDir = tryResolvePackageDir('@mui/x-date-pickers');
if (muiDatePickersDir) vendorAliases['@mui/x-date-pickers'] = muiDatePickersDir;

const muiDataGridDir = tryResolvePackageDir('@mui/x-data-grid');
if (muiDataGridDir) vendorAliases['@mui/x-data-grid'] = muiDataGridDir;

function resolveHelixLibraryStylePath() {
	const helixLibraryDir = tryResolvePackageDir('@helix/component-library');
	if (!helixLibraryDir) return null;

	const distStylePath = path.join(helixLibraryDir, 'dist/assets/style.css');
	if (existsSync(distStylePath)) return distStylePath;

	const sourceStylePath = path.join(helixLibraryDir, 'src/styles/common.css');
	if (existsSync(sourceStylePath)) return sourceStylePath;

	return null;
}

const helixLibraryStylePath = resolveHelixLibraryStylePath();

// Custom plugin to handle react-is resolution
const reactIsResolverPlugin = {
	name: 'resolve-react-is',
	setup(build) {
		build.onResolve({ filter: /^react-is$/ }, (args) => {
			try {
				const reactIsPath = requireFromShell.resolve('react-is');
				return {
					path: reactIsPath,
					namespace: 'file',
				};
			} catch {
				try {
					const reactIsPath = requireFromRoot.resolve('react-is');
					return {
						path: reactIsPath,
						namespace: 'file',
					};
				} catch {
					// Fallback to direct path resolution
					const fallbackPath = path.join(
						__dirname,
						'../../node_modules/.pnpm/react-is@19.2.8/node_modules/react-is/index.js'
					);
					return {
						path: fallbackPath,
						namespace: 'file',
					};
				}
			}
		});
	},
};
/** Writes public/config.json from .env.[mode] so production builds load the right APIs at runtime. */
function generateRuntimeConfigPlugin(mode) {
	return {
		name: 'generate-runtime-config',
		buildStart() {
			generateRuntimeConfig(mode);
		},
	};
}

export default defineConfig(({ mode, command }) => {
 // Load env variables
  const env = loadEnv(mode, __dirname, '');
	const cspStyleNonce = command === 'build' ? randomBytes(16).toString('base64') : 'dev-style-nonce';
	const cspNoncePlugin = {
		name: 'inject-csp-style-nonce',
		transformIndexHtml(html) {
			return html.replaceAll('__CSP_STYLE_NONCE__', cspStyleNonce);
		}
	};

  console.log("Current Vite mode:", mode);
  if (command === 'build') {
    console.log(`[vite.config.js] Build will generate public/config.json from .env.${mode} (fetched at runtime in browser)`);
  } else {
    console.log("[vite.config.js] Dev will use VITE_* variables from .env:", mode);
    console.log("VITE_BASE_KEYCLOAK_API_PATH:", env.VITE_BASE_KEYCLOAK_API_PATH);
  }
	
  
  return {
	  base: '/drs/',
	  plugins: [
		react(), 
		cspNoncePlugin, 
		reactIsResolverPlugin, // Add the custom plugin
		...(command === 'build' ? [generateRuntimeConfigPlugin(mode)] : []),
	  ],
	  build: {
		minify: false,
		outDir: 'drs-build/drs',
		emptyOutDir: true,
        // Reduce memory pressure: only generate source maps in development
        sourcemap: mode === 'development',
        // Keep CSS split to avoid huge single bundles
        cssCodeSplit: true,
        // Avoid reporting tiny chunk warnings, tune as needed
        chunkSizeWarningLimit: 2000,
        // Disable brotli size calculation to save memory during build
        brotliSize: false,
		// Add commonjs options to help with react-is
		commonjsOptions: {
			include: [/node_modules/],
			transformMixedEsModules: true,
		},
    },
	resolve: {
		alias: {
			...vendorAliases,
			// Use direct path for react-is
			'react-is': resolveReactIs(),
			'@ruleengine': path.resolve(__dirname, "../../products/collection/modules/ruleengine"),
			...(helixLibraryStylePath
				? { '@helix-component-library-styles': helixLibraryStylePath }
				: {}),
			'@usermanagement': path.resolve(__dirname, '../../products/user-management/modules/idmUI'),
			'@collections': path.resolve(__dirname, '../../products/collection/modules'),
			'@common-master': path.resolve(__dirname, '../../products/collection/modules/common-master'),
			'@allocation': path.resolve(__dirname, '../../products/collection/modules/allocation'),
			'@earlycollection': path.resolve(__dirname, '../../products/collection/modules/early-collection'),
			'@batchframework': path.resolve(__dirname, '../../products/batch-framework/modules/batch-framework'),
			'@los': path.resolve(__dirname, '../../products/los/modules/application-entry'),
			'@integrationframework': path.resolve(__dirname, "../../products/integration-framework/modules"),
			'@utility': path.resolve(__dirname, "../../products/utility/modules"),
			'@shared': path.resolve(__dirname, '../../shared'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@resources': path.resolve(__dirname, './src/resources-files'),
			'@images': path.resolve(__dirname, './src/images'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@translations': path.resolve(__dirname, '../../products/collection/translations'),
			'@constants': path.resolve(__dirname, './src/constants'),
		},
		dedupe: [
			'react',
			'react-dom',
			'react-router-dom',
			'@mui/material',
			'@mui/system',
			'@emotion/react',
			'@emotion/styled',
			'react-is', // Add react-is to dedupe
		],
	},
    define: {
      'process.env': env,
      __VITE_BUILD_ENV__: JSON.stringify(mode),
    },
    optimizeDeps: {
      include: [
		'react', 
		'react-dom', 
		'react-router-dom', 
		'axios', 
		'@tanstack/react-query', 
		'@tanstack/react-query-devtools',
		'@emotion/styled',
		'react-is', // Add react-is here
		'recharts', // Add recharts since it depends on react-is
		'prop-types', // Add prop-types since it uses react-is
		'@mui/material',
		'@mui/icons-material',
		'@emotion/react',
		'@emotion/styled',
		'@mui/system',
		'@mui/base'
	],
	// Force re-optimization
	force: true, // Set to true temporarily to rebuild cache
	esbuildOptions: {
		// Ensure ESBuild can handle the react-is package
		mainFields: ['module', 'main'],
	},
    },
	// Add server configuration for proper resolution
	server: {
		fs: {
			// Allow serving files from outside the root
			strict: false,
		},
		// Workflow Designer (Workflow Registry) no longer needs a dev-proxy here —
		// masterApi.js / workflowService.js / activityMetadataService.js now call
		// full URLs built from VITE_BASE_WORKFLOW_MASTER_API_PATH /
		// VITE_BASE_WORKFLOW_REGISTRY_API_PATH (see .env.development), same as
		// every other DRS service (getKeycloakApiPath(), getCommonMasterApiPath(), etc).
	},
	// Add ssr configuration to handle react-is
	ssr: {
		noExternal: ['react-is', 'prop-types'],
	},
	}; 
});

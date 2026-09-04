import { dN as reactExports, cV as generateUtilityClass, cW as generateUtilityClasses, eb as useDefaultProps, dB as jsxRuntimeExports, z as ButtonGroupContext, y as ButtonGroupButtonContext, cC as clsx, cA as capitalize, cE as composeClasses, d$ as styled, dE as memoTheme, cG as createSimplePaletteValueFilter, cH as createSvgIcon, dy as isNumber, cq as adaptEventHandlers, e2 as svgPropertiesNoEvents, _ as DefaultZIndexes, dv as isClipDot, e1 as svgPropertiesAndEventsFromUnknown, cp as ZIndexLayer, a_ as Layer, e6 as useAppSelector, dP as selectActiveTooltipIndex, e4 as useActiveTooltipDataPoints, dx as isNullish, e3 as svgPropertiesNoEventsFromUnknown, cF as createSelector, dU as selectChartLayout, dT as selectChartDataWithIndexesIfNotInPanoramaPosition4, dQ as selectAxisWithScale, dW as selectTicksOfGraphicalItem, dX as selectUnfilteredCartesianItems, du as isCategoricalAxis, cY as getBandSizeOfAxis, dJ as propsAreEqual, dO as resolveDefaultProps, ee as useIsPanorama, bA as RegisterGraphicalItemId, bP as SetLegendPayload, bN as SetCartesianGraphicalItem, d8 as getTooltipNameProp, bQ as SetTooltipEntrySettings, dG as noop, ei as useNeedsClip, ek as usePlotArea, e8 as useChartLayout, aL as GraphicalItemClipPath, bO as SetErrorBarContext, d9 as getValueByDataKey, c_ as getCateCoordinateOfLine, e5 as useAnimationId, aV as JavascriptAnimate, dt as interpolate, aZ as LabelListFromLabelProp, G as CartesianLabelListContextProvider, e0 as svgPropertiesAndEvents, bS as Shape, dS as selectChartDataWithIndexesIfNotInPanoramaPosition3, dR as selectChartBaseValue, dY as selectXAxisIdFromGraphicalItemId, dZ as selectYAxisIdFromGraphicalItemId, d7 as getStackSeriesIdentifier, dV as selectStackGroups, d5 as getNormalizedStackId, e9 as useChartName, e7 as useCartesianChartLayout, dw as isNan, X as Curve, dz as isWellBehavedNumber, E as CartesianChart, cu as arrayTooltipSearcher, em as useTheme, eg as useMediaQuery, v as Box, bg as Paper, cf as Typography, bB as ResponsiveContainer, F as CartesianGrid, cn as XAxis, co as YAxis, cb as Tooltip, a$ as Legend, r as Bar, cr as alpha, bq as PieChart, bp as Pie, H as Cell, bx as React, ef as useLocation, ac as Dt, dK as ps, bH as SE, cc as Tooltip$1, aR as IconButton, aB as FiTrash2, eq as withAlpha, aE as FiX, aa as Divider, b0 as Lg, av as FiPlus, bV as Stack, cs as ap, bJ as SaveIcon, bL as SearchIcon, O as CloseIcon, aX as Kr, R as ColListingAPI, cJ as dc, en as userSearchGridDef, ed as useIntl, ct as ar, aG as FollowupAPI, t as Block, w as Button, aW as Kg, bI as SEARCH_API_ENDPOINTS, cg as Ug, dD as lE, dI as pp, cB as cc, S as Collapse, u as BoltOutlinedIcon, cI as dayjs, a1 as DeleteOutlineIcon, cj as Vg, cQ as formatDateTimeForApi, aY as LE, M as Chip, bU as Slide, c8 as TagAccountAPI, N as CircularProgress, g as AddIcon, c7 as Tag, $ as $e, ea as useColorTheme, dF as mixColors, bb as MemosAPI, aN as GroupsOutlinedIcon, a3 as DescriptionOutlinedIcon, ec as useDispatch, eh as useNavigate, d_ as setSelectedRow, cN as fetchHeaderData, aJ as FunctionFrameworkAPI, i as Alert, V as Container, b8 as MdClear, ba as MdSearch, ao as FiChevronDown, ay as FiSliders, ap as FiDownload, aO as HE, aA as FiTag, aD as FiUsers, aw as FiRefreshCw, ar as FiFileText, at as FiMessageSquare, a8 as DialogTitle, b9 as MdClose, a7 as DialogContent, aC as FiTrendingUp, am as FiAnchor, as as FiLink, an as FiCheckCircle, az as FiStar, ax as FiShield, ak as FiAlertCircle, cZ as getBucketToneIndex, au as FiPhone, aq as FiEye, bt as PropTypes } from "./index-BhdgJqva.js";
import { b as CollectorMasterAPI } from "./apiEndpoints-CGlR3-gk.js";
import { C as Call } from "./Call-DxIyuu8_.js";
import { a as PhoneMissed, P as PhoneDisabled, S as Smartphone, N as NearMeOutlinedIcon } from "./Smartphone-b9hlPxr7.js";
import { h as handleValidationErrors } from "./ValidationUtils-BDW9M30M.js";
import { A as AccountCircleOutlinedIcon, b as memosTextSx } from "./memosStyles-D5VJ0eS1.js";
function getValidReactChildren(children) {
  return reactExports.Children.toArray(children).filter((child) => /* @__PURE__ */ reactExports.isValidElement(child));
}
function getButtonGroupUtilityClass(slot) {
  return generateUtilityClass("MuiButtonGroup", slot);
}
const buttonGroupClasses = generateUtilityClasses("MuiButtonGroup", ["root", "contained", "outlined", "text", "disableElevation", "disabled", "firstButton", "fullWidth", "horizontal", "vertical", "colorPrimary", "colorSecondary", "grouped", "groupedHorizontal", "groupedVertical", "groupedText", "groupedTextHorizontal", "groupedTextVertical", "groupedTextPrimary", "groupedTextSecondary", "groupedOutlined", "groupedOutlinedHorizontal", "groupedOutlinedVertical", "groupedOutlinedPrimary", "groupedOutlinedSecondary", "groupedContained", "groupedContainedHorizontal", "groupedContainedVertical", "groupedContainedPrimary", "groupedContainedSecondary", "lastButton", "middleButton"]);
const overridesResolver = (props, styles) => {
  const {
    ownerState
  } = props;
  return [{
    [`& .${buttonGroupClasses.grouped}`]: styles.grouped
  }, {
    [`& .${buttonGroupClasses.grouped}`]: styles[`grouped${capitalize(ownerState.orientation)}`]
  }, {
    [`& .${buttonGroupClasses.grouped}`]: styles[`grouped${capitalize(ownerState.variant)}`]
  }, {
    [`& .${buttonGroupClasses.grouped}`]: styles[`grouped${capitalize(ownerState.variant)}${capitalize(ownerState.orientation)}`]
  }, {
    [`& .${buttonGroupClasses.grouped}`]: styles[`grouped${capitalize(ownerState.variant)}${capitalize(ownerState.color)}`]
  }, {
    [`& .${buttonGroupClasses.firstButton}`]: styles.firstButton
  }, {
    [`& .${buttonGroupClasses.lastButton}`]: styles.lastButton
  }, {
    [`& .${buttonGroupClasses.middleButton}`]: styles.middleButton
  }, styles.root, styles[ownerState.variant], ownerState.disableElevation === true && styles.disableElevation, ownerState.fullWidth && styles.fullWidth, ownerState.orientation === "vertical" && styles.vertical];
};
const useUtilityClasses = (ownerState) => {
  const {
    classes,
    color,
    disabled,
    disableElevation,
    fullWidth,
    orientation,
    variant
  } = ownerState;
  const slots = {
    root: ["root", variant, orientation, fullWidth && "fullWidth", disableElevation && "disableElevation", `color${capitalize(color)}`],
    grouped: ["grouped", `grouped${capitalize(orientation)}`, `grouped${capitalize(variant)}`, `grouped${capitalize(variant)}${capitalize(orientation)}`, `grouped${capitalize(variant)}${capitalize(color)}`, disabled && "disabled"],
    firstButton: ["firstButton"],
    lastButton: ["lastButton"],
    middleButton: ["middleButton"]
  };
  return composeClasses(slots, getButtonGroupUtilityClass, classes);
};
const ButtonGroupRoot = styled("div", {
  name: "MuiButtonGroup",
  slot: "Root",
  overridesResolver
})(memoTheme(({
  theme
}) => ({
  display: "inline-flex",
  borderRadius: (theme.vars || theme).shape.borderRadius,
  variants: [{
    props: {
      variant: "contained"
    },
    style: {
      boxShadow: (theme.vars || theme).shadows[2],
      [`& .${buttonGroupClasses.grouped}`]: {
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none"
        }
      }
    }
  }, {
    props: {
      disableElevation: true
    },
    style: {
      boxShadow: "none"
    }
  }, {
    props: {
      fullWidth: true
    },
    style: {
      width: "100%"
    }
  }, {
    props: {
      orientation: "vertical"
    },
    style: {
      flexDirection: "column",
      [`& .${buttonGroupClasses.lastButton},& .${buttonGroupClasses.middleButton}`]: {
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0
      },
      [`& .${buttonGroupClasses.firstButton},& .${buttonGroupClasses.middleButton}`]: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
      }
    }
  }, {
    props: {
      orientation: "horizontal"
    },
    style: {
      [`& .${buttonGroupClasses.firstButton},& .${buttonGroupClasses.middleButton}`]: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
      },
      [`& .${buttonGroupClasses.lastButton},& .${buttonGroupClasses.middleButton}`]: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      }
    }
  }, {
    props: {
      variant: "text",
      orientation: "horizontal"
    },
    style: {
      [`& .${buttonGroupClasses.firstButton},& .${buttonGroupClasses.middleButton}`]: {
        borderRight: theme.vars ? `1px solid ${theme.alpha(theme.vars.palette.common.onBackground, 0.23)}` : `1px solid ${theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)"}`,
        [`&.${buttonGroupClasses.disabled}`]: {
          borderRight: `1px solid ${(theme.vars || theme).palette.action.disabled}`
        }
      }
    }
  }, {
    props: {
      variant: "text",
      orientation: "vertical"
    },
    style: {
      [`& .${buttonGroupClasses.firstButton},& .${buttonGroupClasses.middleButton}`]: {
        borderBottom: theme.vars ? `1px solid ${theme.alpha(theme.vars.palette.common.onBackground, 0.23)}` : `1px solid ${theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)"}`,
        [`&.${buttonGroupClasses.disabled}`]: {
          borderBottom: `1px solid ${(theme.vars || theme).palette.action.disabled}`
        }
      }
    }
  }, ...Object.entries(theme.palette).filter(createSimplePaletteValueFilter()).flatMap(([color]) => [{
    props: {
      variant: "text",
      color
    },
    style: {
      [`& .${buttonGroupClasses.firstButton},& .${buttonGroupClasses.middleButton}`]: {
        borderColor: theme.alpha((theme.vars || theme).palette[color].main, 0.5)
      }
    }
  }]), {
    props: {
      variant: "outlined",
      orientation: "horizontal"
    },
    style: {
      [`& .${buttonGroupClasses.firstButton},& .${buttonGroupClasses.middleButton}`]: {
        borderRightColor: "transparent",
        "&:hover": {
          borderRightColor: "currentColor"
        }
      },
      [`& .${buttonGroupClasses.lastButton},& .${buttonGroupClasses.middleButton}`]: {
        marginLeft: -1
      }
    }
  }, {
    props: {
      variant: "outlined",
      orientation: "vertical"
    },
    style: {
      [`& .${buttonGroupClasses.firstButton},& .${buttonGroupClasses.middleButton}`]: {
        borderBottomColor: "transparent",
        "&:hover": {
          borderBottomColor: "currentColor"
        }
      },
      [`& .${buttonGroupClasses.lastButton},& .${buttonGroupClasses.middleButton}`]: {
        marginTop: -1
      }
    }
  }, {
    props: {
      variant: "contained",
      orientation: "horizontal"
    },
    style: {
      [`& .${buttonGroupClasses.firstButton},& .${buttonGroupClasses.middleButton}`]: {
        borderRight: `1px solid ${(theme.vars || theme).palette.grey[400]}`,
        [`&.${buttonGroupClasses.disabled}`]: {
          borderRight: `1px solid ${(theme.vars || theme).palette.action.disabled}`
        }
      }
    }
  }, {
    props: {
      variant: "contained",
      orientation: "vertical"
    },
    style: {
      [`& .${buttonGroupClasses.firstButton},& .${buttonGroupClasses.middleButton}`]: {
        borderBottom: `1px solid ${(theme.vars || theme).palette.grey[400]}`,
        [`&.${buttonGroupClasses.disabled}`]: {
          borderBottom: `1px solid ${(theme.vars || theme).palette.action.disabled}`
        }
      }
    }
  }, ...Object.entries(theme.palette).filter(createSimplePaletteValueFilter(["dark"])).map(([color]) => ({
    props: {
      variant: "contained",
      color
    },
    style: {
      [`& .${buttonGroupClasses.firstButton},& .${buttonGroupClasses.middleButton}`]: {
        borderColor: (theme.vars || theme).palette[color].dark
      }
    }
  }))],
  [`& .${buttonGroupClasses.grouped}`]: {
    minWidth: 40
  }
})));
const ButtonGroup = /* @__PURE__ */ reactExports.forwardRef(function ButtonGroup2(inProps, ref) {
  const props = useDefaultProps({
    props: inProps,
    name: "MuiButtonGroup"
  });
  const {
    children,
    className,
    color = "primary",
    component = "div",
    disabled = false,
    disableElevation = false,
    disableFocusRipple = false,
    disableRipple = false,
    fullWidth = false,
    orientation = "horizontal",
    size = "medium",
    variant = "outlined",
    ...other
  } = props;
  const ownerState = {
    ...props,
    color,
    component,
    disabled,
    disableElevation,
    disableFocusRipple,
    disableRipple,
    fullWidth,
    orientation,
    size,
    variant
  };
  const classes = useUtilityClasses(ownerState);
  const context = reactExports.useMemo(() => ({
    className: classes.grouped,
    color,
    disabled,
    disableElevation,
    disableFocusRipple,
    disableRipple,
    fullWidth,
    size,
    variant
  }), [color, disabled, disableElevation, disableFocusRipple, disableRipple, fullWidth, size, variant, classes.grouped]);
  const validChildren = getValidReactChildren(children);
  const childrenCount = validChildren.length;
  const getButtonPositionClassName = (index) => {
    const isFirstButton = index === 0;
    const isLastButton = index === childrenCount - 1;
    if (isFirstButton && isLastButton) {
      return "";
    }
    if (isFirstButton) {
      return classes.firstButton;
    }
    if (isLastButton) {
      return classes.lastButton;
    }
    return classes.middleButton;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ButtonGroupRoot, {
    as: component,
    role: "group",
    className: clsx(classes.root, className),
    ref,
    ownerState,
    ...other,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ButtonGroupContext.Provider, {
      value: context,
      children: validChildren.map((child, index) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(ButtonGroupButtonContext.Provider, {
          value: getButtonPositionClassName(index),
          children: child
        }, index);
      })
    })
  });
});
const BackspaceIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12z"
}));
const ShareOutlinedIcon = createSvgIcon(/* @__PURE__ */ jsxRuntimeExports.jsx("path", {
  d: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92M18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1M6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1"
}));
function _extends$3() {
  return _extends$3 = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$3.apply(null, arguments);
}
var Dot = (props) => {
  var {
    cx,
    cy,
    r,
    className
  } = props;
  var layerClass = clsx("recharts-dot", className);
  if (isNumber(cx) && isNumber(cy) && isNumber(r)) {
    return /* @__PURE__ */ reactExports.createElement("circle", _extends$3({}, svgPropertiesNoEvents(props), adaptEventHandlers(props), {
      className: layerClass,
      cx,
      cy,
      r
    }));
  }
  return null;
};
var _excluded$2 = ["points"];
function ownKeys$3(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$3(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$3(Object(t), true).forEach(function(r2) {
      _defineProperty$3(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$3(e, r, t) {
  return (r = _toPropertyKey$3(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$3(t) {
  var i = _toPrimitive$3(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$3(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _extends$2() {
  return _extends$2 = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$2.apply(null, arguments);
}
function _objectWithoutProperties$2(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose$2(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose$2(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function DotItem(_ref) {
  var {
    option,
    dotProps,
    className
  } = _ref;
  if (/* @__PURE__ */ reactExports.isValidElement(option)) {
    return /* @__PURE__ */ reactExports.cloneElement(option, dotProps);
  }
  if (typeof option === "function") {
    return option(dotProps);
  }
  var finalClassName = clsx(className, typeof option !== "boolean" ? option.className : "");
  var _ref2 = dotProps !== null && dotProps !== void 0 ? dotProps : {}, {
    points
  } = _ref2, props = _objectWithoutProperties$2(_ref2, _excluded$2);
  return /* @__PURE__ */ reactExports.createElement(Dot, _extends$2({}, props, {
    className: finalClassName
  }));
}
function shouldRenderDots(points, dot) {
  if (points == null) {
    return false;
  }
  if (dot) {
    return true;
  }
  return points.length === 1;
}
function Dots(_ref3) {
  var {
    points,
    dot,
    className,
    dotClassName,
    dataKey,
    baseProps,
    needClip,
    clipPathId,
    zIndex = DefaultZIndexes.scatter
  } = _ref3;
  if (!shouldRenderDots(points, dot)) {
    return null;
  }
  var clipDot = isClipDot(dot);
  var customDotProps = svgPropertiesAndEventsFromUnknown(dot);
  var dots = points.map((entry, i) => {
    var _entry$x, _entry$y;
    var dotProps = _objectSpread$3(_objectSpread$3(_objectSpread$3({
      r: 3
    }, baseProps), customDotProps), {}, {
      index: i,
      cx: (_entry$x = entry.x) !== null && _entry$x !== void 0 ? _entry$x : void 0,
      cy: (_entry$y = entry.y) !== null && _entry$y !== void 0 ? _entry$y : void 0,
      dataKey,
      value: entry.value,
      payload: entry.payload,
      points
    });
    return /* @__PURE__ */ reactExports.createElement(DotItem, {
      key: "dot-".concat(i),
      option: dot,
      dotProps,
      className: dotClassName
    });
  });
  var layerProps = {};
  if (needClip && clipPathId != null) {
    layerProps.clipPath = "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")");
  }
  return /* @__PURE__ */ reactExports.createElement(ZIndexLayer, {
    zIndex
  }, /* @__PURE__ */ reactExports.createElement(Layer, _extends$2({
    className
  }, layerProps), dots));
}
function ownKeys$2(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$2(Object(t), true).forEach(function(r2) {
      _defineProperty$2(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$2(e, r, t) {
  return (r = _toPropertyKey$2(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$2(t) {
  var i = _toPrimitive$2(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$2(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var ActivePoint = (_ref) => {
  var {
    point,
    childIndex,
    mainColor,
    activeDot,
    dataKey,
    clipPath
  } = _ref;
  if (activeDot === false || point.x == null || point.y == null) {
    return null;
  }
  var dotPropsTyped = {
    index: childIndex,
    dataKey,
    cx: point.x,
    cy: point.y,
    r: 4,
    fill: mainColor !== null && mainColor !== void 0 ? mainColor : "none",
    strokeWidth: 2,
    stroke: "#fff",
    payload: point.payload,
    value: point.value
  };
  var dotProps = _objectSpread$2(_objectSpread$2(_objectSpread$2({}, dotPropsTyped), svgPropertiesNoEventsFromUnknown(activeDot)), adaptEventHandlers(activeDot));
  var dot;
  if (/* @__PURE__ */ reactExports.isValidElement(activeDot)) {
    dot = /* @__PURE__ */ reactExports.cloneElement(activeDot, dotProps);
  } else if (typeof activeDot === "function") {
    dot = activeDot(dotProps);
  } else {
    dot = /* @__PURE__ */ reactExports.createElement(Dot, dotProps);
  }
  return /* @__PURE__ */ reactExports.createElement(Layer, {
    className: "recharts-active-dot",
    clipPath
  }, dot);
};
function ActivePoints(_ref2) {
  var {
    points,
    mainColor,
    activeDot,
    itemDataKey,
    clipPath,
    zIndex = DefaultZIndexes.activeDot
  } = _ref2;
  var activeTooltipIndex = useAppSelector(selectActiveTooltipIndex);
  var activeDataPoints = useActiveTooltipDataPoints();
  if (points == null || activeDataPoints == null) {
    return null;
  }
  var activePoint = points.find((p) => activeDataPoints.includes(p.payload));
  if (isNullish(activePoint)) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(ZIndexLayer, {
    zIndex
  }, /* @__PURE__ */ reactExports.createElement(ActivePoint, {
    point: activePoint,
    childIndex: Number(activeTooltipIndex),
    mainColor,
    dataKey: itemDataKey,
    activeDot,
    clipPath
  }));
}
var selectXAxisWithScale$1 = (state, xAxisId, _yAxisId, isPanorama) => selectAxisWithScale(state, "xAxis", xAxisId, isPanorama);
var selectXAxisTicks$1 = (state, xAxisId, _yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, "xAxis", xAxisId, isPanorama);
var selectYAxisWithScale$1 = (state, _xAxisId, yAxisId, isPanorama) => selectAxisWithScale(state, "yAxis", yAxisId, isPanorama);
var selectYAxisTicks$1 = (state, _xAxisId, yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, "yAxis", yAxisId, isPanorama);
var selectBandSize$1 = createSelector([selectChartLayout, selectXAxisWithScale$1, selectYAxisWithScale$1, selectXAxisTicks$1, selectYAxisTicks$1], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
  if (isCategoricalAxis(layout, "xAxis")) {
    return getBandSizeOfAxis(xAxis, xAxisTicks, false);
  }
  return getBandSizeOfAxis(yAxis, yAxisTicks, false);
});
var pickLineId = (_state, _xAxisId, _yAxisId, _isPanorama, id) => id;
function isLineSettings(item) {
  return item.type === "line";
}
var selectSynchronisedLineSettings = createSelector([selectUnfilteredCartesianItems, pickLineId], (graphicalItems, id) => graphicalItems.filter(isLineSettings).find((x) => x.id === id));
var selectLinePoints = createSelector([selectChartLayout, selectXAxisWithScale$1, selectYAxisWithScale$1, selectXAxisTicks$1, selectYAxisTicks$1, selectSynchronisedLineSettings, selectBandSize$1, selectChartDataWithIndexesIfNotInPanoramaPosition4], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, lineSettings, bandSize, _ref) => {
  var {
    chartData,
    dataStartIndex,
    dataEndIndex
  } = _ref;
  if (lineSettings == null || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null || layout !== "horizontal" && layout !== "vertical") {
    return void 0;
  }
  var {
    dataKey,
    data
  } = lineSettings;
  var displayedData;
  if (data != null && data.length > 0) {
    displayedData = data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null) {
    return void 0;
  }
  return computeLinePoints({
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataKey,
    bandSize,
    displayedData
  });
});
function getRadiusAndStrokeWidthFromDot(dot) {
  var props = svgPropertiesNoEventsFromUnknown(dot);
  var defaultR = 3;
  var defaultStrokeWidth = 2;
  if (props != null) {
    var {
      r,
      strokeWidth
    } = props;
    var realR = Number(r);
    var realStrokeWidth = Number(strokeWidth);
    if (Number.isNaN(realR) || realR < 0) {
      realR = defaultR;
    }
    if (Number.isNaN(realStrokeWidth) || realStrokeWidth < 0) {
      realStrokeWidth = defaultStrokeWidth;
    }
    return {
      r: realR,
      strokeWidth: realStrokeWidth
    };
  }
  return {
    r: defaultR,
    strokeWidth: defaultStrokeWidth
  };
}
var _excluded$1 = ["id"], _excluded2$1 = ["type", "layout", "connectNulls", "needClip", "shape"], _excluded3 = ["activeDot", "animateNewValues", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "hide", "isAnimationActive", "label", "legendType", "xAxisId", "yAxisId", "id"];
function _extends$1() {
  return _extends$1 = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$1.apply(null, arguments);
}
function ownKeys$1(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$1(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$1(Object(t), true).forEach(function(r2) {
      _defineProperty$1(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$1(e, r, t) {
  return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$1(t) {
  var i = _toPrimitive$1(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$1(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties$1(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose$1(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose$1(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
var computeLegendPayloadFromAreaData$1 = (props) => {
  var {
    dataKey,
    name,
    stroke,
    legendType,
    hide
  } = props;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: stroke,
    value: getTooltipNameProp(name, dataKey),
    payload: props
  }];
};
var SetLineTooltipEntrySettings = /* @__PURE__ */ reactExports.memo((_ref) => {
  var {
    dataKey,
    data,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    unit,
    tooltipType,
    id
  } = _ref;
  var tooltipEntrySettings = {
    dataDefinedOnItem: data,
    getPosition: noop,
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      nameKey: void 0,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: tooltipType,
      color: stroke,
      unit,
      graphicalItemId: id
    }
  };
  return /* @__PURE__ */ reactExports.createElement(SetTooltipEntrySettings, {
    tooltipEntrySettings
  });
});
var generateSimpleStrokeDasharray = (totalLength, length) => {
  return "".concat(length, "px ").concat(totalLength, "px");
};
function repeat(lines, count) {
  var linesUnit = lines.length % 2 !== 0 ? [...lines, 0] : lines;
  var result = [];
  for (var i = 0; i < count; ++i) {
    result.push(...linesUnit);
  }
  return result;
}
var getStrokeDasharray = (length, totalLength, lines) => {
  var lineLength = lines.reduce((pre, next) => pre + next, 0);
  if (!lineLength) {
    return generateSimpleStrokeDasharray(totalLength, length);
  }
  var count = Math.floor(length / lineLength);
  var remainLength = length % lineLength;
  var remainLines = [];
  for (var i = 0, sum = 0; i < lines.length; sum += (_lines$i = lines[i]) !== null && _lines$i !== void 0 ? _lines$i : 0, ++i) {
    var _lines$i;
    var lineValue = lines[i];
    if (lineValue != null && sum + lineValue > remainLength) {
      remainLines = [...lines.slice(0, i), remainLength - sum];
      break;
    }
  }
  var emptyLines = remainLines.length % 2 === 0 ? [0, totalLength] : [totalLength];
  return [...repeat(lines, count), ...remainLines, ...emptyLines].map((line) => "".concat(line, "px")).join(", ");
};
function LineDotsWrapper(_ref2) {
  var {
    clipPathId,
    points,
    props
  } = _ref2;
  var {
    dot,
    dataKey,
    needClip
  } = props;
  var {
    id
  } = props, propsWithoutId = _objectWithoutProperties$1(props, _excluded$1);
  var lineProps = svgPropertiesNoEvents(propsWithoutId);
  return /* @__PURE__ */ reactExports.createElement(Dots, {
    points,
    dot,
    className: "recharts-line-dots",
    dotClassName: "recharts-line-dot",
    dataKey,
    baseProps: lineProps,
    needClip,
    clipPathId
  });
}
function LineLabelListProvider(_ref3) {
  var {
    showLabels,
    children,
    points
  } = _ref3;
  var labelListEntries = reactExports.useMemo(() => {
    return points === null || points === void 0 ? void 0 : points.map((point) => {
      var _point$x, _point$y;
      var viewBox = {
        x: (_point$x = point.x) !== null && _point$x !== void 0 ? _point$x : 0,
        y: (_point$y = point.y) !== null && _point$y !== void 0 ? _point$y : 0,
        width: 0,
        lowerWidth: 0,
        upperWidth: 0,
        height: 0
      };
      return _objectSpread$1(_objectSpread$1({}, viewBox), {}, {
        value: point.value,
        payload: point.payload,
        viewBox,
        /*
         * Line is not passing parentViewBox to the LabelList so the labels can escape - looks like a bug, should we pass parentViewBox?
         * Or should this just be the root chart viewBox?
         */
        parentViewBox: void 0,
        fill: void 0
      });
    });
  }, [points]);
  return /* @__PURE__ */ reactExports.createElement(CartesianLabelListContextProvider, {
    value: showLabels ? labelListEntries : void 0
  }, children);
}
function StaticCurve(_ref4) {
  var {
    clipPathId,
    pathRef,
    points,
    strokeDasharray,
    props
  } = _ref4;
  var {
    type,
    layout,
    connectNulls,
    needClip,
    shape
  } = props, others = _objectWithoutProperties$1(props, _excluded2$1);
  var curveProps = _objectSpread$1(_objectSpread$1({}, svgPropertiesAndEvents(others)), {}, {
    fill: "none",
    className: "recharts-line-curve",
    clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : void 0,
    points,
    type,
    layout,
    connectNulls,
    strokeDasharray: strokeDasharray !== null && strokeDasharray !== void 0 ? strokeDasharray : props.strokeDasharray
  });
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /* @__PURE__ */ reactExports.createElement(Shape, _extends$1({
    shapeType: "curve",
    option: shape
  }, curveProps, {
    pathRef
  })), /* @__PURE__ */ reactExports.createElement(LineDotsWrapper, {
    points,
    clipPathId,
    props
  }));
}
function getTotalLength(mainCurve) {
  try {
    return mainCurve && mainCurve.getTotalLength && mainCurve.getTotalLength() || 0;
  } catch (_unused) {
    return 0;
  }
}
function CurveWithAnimation(_ref5) {
  var {
    clipPathId,
    props,
    pathRef,
    previousPointsRef,
    longestAnimatedLengthRef
  } = _ref5;
  var {
    points,
    strokeDasharray,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    animateNewValues,
    width,
    height,
    onAnimationEnd,
    onAnimationStart
  } = props;
  var prevPoints = previousPointsRef.current;
  var animationId = useAnimationId(points, "recharts-line-");
  var animationIdRef = reactExports.useRef(animationId);
  var [isAnimating, setIsAnimating] = reactExports.useState(false);
  var showLabels = !isAnimating;
  var handleAnimationEnd = reactExports.useCallback(() => {
    if (typeof onAnimationEnd === "function") {
      onAnimationEnd();
    }
    setIsAnimating(false);
  }, [onAnimationEnd]);
  var handleAnimationStart = reactExports.useCallback(() => {
    if (typeof onAnimationStart === "function") {
      onAnimationStart();
    }
    setIsAnimating(true);
  }, [onAnimationStart]);
  var totalLength = getTotalLength(pathRef.current);
  var startingPointRef = reactExports.useRef(0);
  if (animationIdRef.current !== animationId) {
    startingPointRef.current = longestAnimatedLengthRef.current;
    animationIdRef.current = animationId;
  }
  var startingPoint = startingPointRef.current;
  return /* @__PURE__ */ reactExports.createElement(LineLabelListProvider, {
    points,
    showLabels
  }, props.children, /* @__PURE__ */ reactExports.createElement(JavascriptAnimate, {
    animationId,
    begin: animationBegin,
    duration: animationDuration,
    isActive: isAnimationActive,
    easing: animationEasing,
    onAnimationEnd: handleAnimationEnd,
    onAnimationStart: handleAnimationStart,
    key: animationId
  }, (t) => {
    var lengthInterpolated = interpolate(startingPoint, totalLength + startingPoint, t);
    var curLength = Math.min(lengthInterpolated, totalLength);
    var currentStrokeDasharray;
    if (isAnimationActive) {
      if (strokeDasharray) {
        var lines = "".concat(strokeDasharray).split(/[,\s]+/gim).map((num) => parseFloat(num));
        currentStrokeDasharray = getStrokeDasharray(curLength, totalLength, lines);
      } else {
        currentStrokeDasharray = generateSimpleStrokeDasharray(totalLength, curLength);
      }
    } else {
      currentStrokeDasharray = strokeDasharray == null ? void 0 : String(strokeDasharray);
    }
    if (t > 0 && totalLength > 0) {
      previousPointsRef.current = points;
      longestAnimatedLengthRef.current = Math.max(longestAnimatedLengthRef.current, curLength);
    }
    if (prevPoints) {
      var prevPointsDiffFactor = prevPoints.length / points.length;
      var stepData = t === 1 ? points : points.map((entry, index) => {
        var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
        if (prevPoints[prevPointIndex]) {
          var prev = prevPoints[prevPointIndex];
          return _objectSpread$1(_objectSpread$1({}, entry), {}, {
            x: interpolate(prev.x, entry.x, t),
            y: interpolate(prev.y, entry.y, t)
          });
        }
        if (animateNewValues) {
          return _objectSpread$1(_objectSpread$1({}, entry), {}, {
            x: interpolate(width * 2, entry.x, t),
            y: interpolate(height / 2, entry.y, t)
          });
        }
        return _objectSpread$1(_objectSpread$1({}, entry), {}, {
          x: entry.x,
          y: entry.y
        });
      });
      previousPointsRef.current = stepData;
      return /* @__PURE__ */ reactExports.createElement(StaticCurve, {
        props,
        points: stepData,
        clipPathId,
        pathRef,
        strokeDasharray: currentStrokeDasharray
      });
    }
    return /* @__PURE__ */ reactExports.createElement(StaticCurve, {
      props,
      points,
      clipPathId,
      pathRef,
      strokeDasharray: currentStrokeDasharray
    });
  }), /* @__PURE__ */ reactExports.createElement(LabelListFromLabelProp, {
    label: props.label
  }));
}
function RenderCurve(_ref6) {
  var {
    clipPathId,
    props
  } = _ref6;
  var previousPointsRef = reactExports.useRef(null);
  var longestAnimatedLengthRef = reactExports.useRef(0);
  var pathRef = reactExports.useRef(null);
  return /* @__PURE__ */ reactExports.createElement(CurveWithAnimation, {
    props,
    clipPathId,
    previousPointsRef,
    longestAnimatedLengthRef,
    pathRef
  });
}
var errorBarDataPointFormatter = (dataPoint, dataKey) => {
  var _dataPoint$x, _dataPoint$y;
  return {
    x: (_dataPoint$x = dataPoint.x) !== null && _dataPoint$x !== void 0 ? _dataPoint$x : void 0,
    y: (_dataPoint$y = dataPoint.y) !== null && _dataPoint$y !== void 0 ? _dataPoint$y : void 0,
    value: dataPoint.value,
    // getValueByDataKey does not validate the output type
    errorVal: getValueByDataKey(dataPoint.payload, dataKey)
  };
};
class LineWithState extends reactExports.Component {
  render() {
    var {
      hide,
      dot,
      points,
      className,
      xAxisId,
      yAxisId,
      top,
      left,
      width,
      height,
      id,
      needClip,
      zIndex
    } = this.props;
    if (hide) {
      return null;
    }
    var layerClass = clsx("recharts-line", className);
    var clipPathId = id;
    var {
      r,
      strokeWidth
    } = getRadiusAndStrokeWidthFromDot(dot);
    var clipDot = isClipDot(dot);
    var dotSize = r * 2 + strokeWidth;
    var activePointsClipPath = needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : void 0;
    return /* @__PURE__ */ reactExports.createElement(ZIndexLayer, {
      zIndex
    }, /* @__PURE__ */ reactExports.createElement(Layer, {
      className: layerClass
    }, needClip && /* @__PURE__ */ reactExports.createElement("defs", null, /* @__PURE__ */ reactExports.createElement(GraphicalItemClipPath, {
      clipPathId,
      xAxisId,
      yAxisId
    }), !clipDot && /* @__PURE__ */ reactExports.createElement("clipPath", {
      id: "clipPath-dots-".concat(clipPathId)
    }, /* @__PURE__ */ reactExports.createElement("rect", {
      x: left - dotSize / 2,
      y: top - dotSize / 2,
      width: width + dotSize,
      height: height + dotSize
    }))), /* @__PURE__ */ reactExports.createElement(SetErrorBarContext, {
      xAxisId,
      yAxisId,
      data: points,
      dataPointFormatter: errorBarDataPointFormatter,
      errorBarOffset: 0
    }, /* @__PURE__ */ reactExports.createElement(RenderCurve, {
      props: this.props,
      clipPathId
    }))), /* @__PURE__ */ reactExports.createElement(ActivePoints, {
      activeDot: this.props.activeDot,
      points,
      mainColor: this.props.stroke,
      itemDataKey: this.props.dataKey,
      clipPath: activePointsClipPath
    }));
  }
}
var defaultLineProps = {
  activeDot: true,
  animateNewValues: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  connectNulls: false,
  dot: true,
  fill: "#fff",
  hide: false,
  isAnimationActive: "auto",
  label: false,
  legendType: "line",
  stroke: "#3182bd",
  strokeWidth: 1,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: DefaultZIndexes.line,
  type: "linear"
};
function LineImpl(props) {
  var _resolveDefaultProps = resolveDefaultProps(props, defaultLineProps), {
    activeDot,
    animateNewValues,
    animationBegin,
    animationDuration,
    animationEasing,
    connectNulls,
    dot,
    hide,
    isAnimationActive,
    label,
    legendType,
    xAxisId,
    yAxisId,
    id
  } = _resolveDefaultProps, everythingElse = _objectWithoutProperties$1(_resolveDefaultProps, _excluded3);
  var {
    needClip
  } = useNeedsClip(xAxisId, yAxisId);
  var plotArea = usePlotArea();
  var layout = useChartLayout();
  var isPanorama = useIsPanorama();
  var points = useAppSelector((state) => selectLinePoints(state, xAxisId, yAxisId, isPanorama, id));
  if (layout !== "horizontal" && layout !== "vertical" || points == null || plotArea == null) {
    return null;
  }
  var {
    height,
    width,
    x: left,
    y: top
  } = plotArea;
  return /* @__PURE__ */ reactExports.createElement(LineWithState, _extends$1({}, everythingElse, {
    id,
    connectNulls,
    dot,
    activeDot,
    animateNewValues,
    animationBegin,
    animationDuration,
    animationEasing,
    isAnimationActive,
    hide,
    label,
    legendType,
    xAxisId,
    yAxisId,
    points,
    layout,
    height,
    width,
    left,
    top,
    needClip
  }));
}
function computeLinePoints(_ref7) {
  var {
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataKey,
    bandSize,
    displayedData
  } = _ref7;
  return displayedData.map((entry, index) => {
    var value = getValueByDataKey(entry, dataKey);
    if (layout === "horizontal") {
      var _x = getCateCoordinateOfLine({
        axis: xAxis,
        ticks: xAxisTicks,
        bandSize,
        entry,
        index
      });
      var _y = isNullish(value) ? null : yAxis.scale.map(value);
      return {
        x: _x,
        y: _y !== null && _y !== void 0 ? _y : null,
        value,
        payload: entry
      };
    }
    var x = isNullish(value) ? null : xAxis.scale.map(value);
    var y = getCateCoordinateOfLine({
      axis: yAxis,
      ticks: yAxisTicks,
      bandSize,
      entry,
      index
    });
    if (x == null || y == null) {
      return null;
    }
    return {
      x,
      y,
      value,
      payload: entry
    };
  }).filter(Boolean);
}
function LineFn(outsideProps) {
  var props = resolveDefaultProps(outsideProps, defaultLineProps);
  var isPanorama = useIsPanorama();
  return /* @__PURE__ */ reactExports.createElement(RegisterGraphicalItemId, {
    id: props.id,
    type: "line"
  }, (id) => /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(SetLegendPayload, {
    legendPayload: computeLegendPayloadFromAreaData$1(props)
  }), /* @__PURE__ */ reactExports.createElement(SetLineTooltipEntrySettings, {
    dataKey: props.dataKey,
    data: props.data,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    name: props.name,
    hide: props.hide,
    unit: props.unit,
    tooltipType: props.tooltipType,
    id
  }), /* @__PURE__ */ reactExports.createElement(SetCartesianGraphicalItem, {
    type: "line",
    id,
    data: props.data,
    xAxisId: props.xAxisId,
    yAxisId: props.yAxisId,
    zAxisId: 0,
    dataKey: props.dataKey,
    hide: props.hide,
    isPanorama
  }), /* @__PURE__ */ reactExports.createElement(LineImpl, _extends$1({}, props, {
    id
  }))));
}
var Line = /* @__PURE__ */ reactExports.memo(LineFn, propsAreEqual);
Line.displayName = "Line";
var selectXAxisWithScale = (state, graphicalItemId, isPanorama) => selectAxisWithScale(state, "xAxis", selectXAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectXAxisTicks = (state, graphicalItemId, isPanorama) => selectTicksOfGraphicalItem(state, "xAxis", selectXAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectYAxisWithScale = (state, graphicalItemId, isPanorama) => selectAxisWithScale(state, "yAxis", selectYAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectYAxisTicks = (state, graphicalItemId, isPanorama) => selectTicksOfGraphicalItem(state, "yAxis", selectYAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectBandSize = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
  if (isCategoricalAxis(layout, "xAxis")) {
    return getBandSizeOfAxis(xAxis, xAxisTicks, false);
  }
  return getBandSizeOfAxis(yAxis, yAxisTicks, false);
});
var pickAreaId = (_state, id) => id;
var selectSynchronisedAreaSettings = createSelector([selectUnfilteredCartesianItems, pickAreaId], (graphicalItems, id) => graphicalItems.filter((item) => item.type === "area").find((item) => item.id === id));
var selectNumericalAxisType = (state) => {
  var layout = selectChartLayout(state);
  var isXAxisCategorical = isCategoricalAxis(layout, "xAxis");
  return isXAxisCategorical ? "yAxis" : "xAxis";
};
var selectNumericalAxisIdFromGraphicalItemId = (state, graphicalItemId) => {
  var axisType = selectNumericalAxisType(state);
  if (axisType === "yAxis") {
    return selectYAxisIdFromGraphicalItemId(state, graphicalItemId);
  }
  return selectXAxisIdFromGraphicalItemId(state, graphicalItemId);
};
var selectNumericalAxisStackGroups = (state, graphicalItemId, isPanorama) => selectStackGroups(state, selectNumericalAxisType(state), selectNumericalAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectGraphicalItemStackedData = createSelector([selectSynchronisedAreaSettings, selectNumericalAxisStackGroups], (areaSettings, stackGroups) => {
  var _stackGroups$stackId;
  if (areaSettings == null || stackGroups == null) {
    return void 0;
  }
  var {
    stackId
  } = areaSettings;
  var stackSeriesIdentifier = getStackSeriesIdentifier(areaSettings);
  if (stackId == null || stackSeriesIdentifier == null) {
    return void 0;
  }
  var groups = (_stackGroups$stackId = stackGroups[stackId]) === null || _stackGroups$stackId === void 0 ? void 0 : _stackGroups$stackId.stackedData;
  var found = groups === null || groups === void 0 ? void 0 : groups.find((v) => v.key === stackSeriesIdentifier);
  if (found == null) {
    return void 0;
  }
  return found.map((item) => [item[0], item[1]]);
});
var selectArea = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks, selectGraphicalItemStackedData, selectChartDataWithIndexesIfNotInPanoramaPosition3, selectBandSize, selectSynchronisedAreaSettings, selectChartBaseValue], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, stackedData, _ref, bandSize, areaSettings, chartBaseValue) => {
  var {
    chartData,
    dataStartIndex,
    dataEndIndex
  } = _ref;
  if (areaSettings == null || layout !== "horizontal" && layout !== "vertical" || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null) {
    return void 0;
  }
  var {
    data
  } = areaSettings;
  var displayedData;
  if (data && data.length > 0) {
    displayedData = data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null) {
    return void 0;
  }
  return computeArea({
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataStartIndex,
    areaSettings,
    stackedData,
    displayedData,
    chartBaseValue,
    bandSize
  });
});
var _excluded = ["id"], _excluded2 = ["activeDot", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "fill", "fillOpacity", "hide", "isAnimationActive", "legendType", "stroke", "xAxisId", "yAxisId"];
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function getLegendItemColor(stroke, fill) {
  return stroke && stroke !== "none" ? stroke : fill;
}
var computeLegendPayloadFromAreaData = (props) => {
  var {
    dataKey,
    name,
    stroke,
    fill,
    legendType,
    hide
  } = props;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: getLegendItemColor(stroke, fill),
    value: getTooltipNameProp(name, dataKey),
    payload: props
  }];
};
var SetAreaTooltipEntrySettings = /* @__PURE__ */ reactExports.memo((_ref) => {
  var {
    dataKey,
    data,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    unit,
    tooltipType,
    id
  } = _ref;
  var tooltipEntrySettings = {
    dataDefinedOnItem: data,
    getPosition: noop,
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      nameKey: void 0,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: tooltipType,
      color: getLegendItemColor(stroke, fill),
      unit,
      graphicalItemId: id
    }
  };
  return /* @__PURE__ */ reactExports.createElement(SetTooltipEntrySettings, {
    tooltipEntrySettings
  });
});
function AreaDotsWrapper(_ref2) {
  var {
    clipPathId,
    points,
    props
  } = _ref2;
  var {
    needClip,
    dot,
    dataKey
  } = props;
  var areaProps = svgPropertiesNoEvents(props);
  return /* @__PURE__ */ reactExports.createElement(Dots, {
    points,
    dot,
    className: "recharts-area-dots",
    dotClassName: "recharts-area-dot",
    dataKey,
    baseProps: areaProps,
    needClip,
    clipPathId
  });
}
function AreaLabelListProvider(_ref3) {
  var {
    showLabels,
    children,
    points
  } = _ref3;
  var labelListEntries = points.map((point) => {
    var _point$x, _point$y;
    var viewBox = {
      x: (_point$x = point.x) !== null && _point$x !== void 0 ? _point$x : 0,
      y: (_point$y = point.y) !== null && _point$y !== void 0 ? _point$y : 0,
      width: 0,
      lowerWidth: 0,
      upperWidth: 0,
      height: 0
    };
    return _objectSpread(_objectSpread({}, viewBox), {}, {
      value: point.value,
      payload: point.payload,
      parentViewBox: void 0,
      viewBox,
      fill: void 0
    });
  });
  return /* @__PURE__ */ reactExports.createElement(CartesianLabelListContextProvider, {
    value: showLabels ? labelListEntries : void 0
  }, children);
}
function StaticArea(_ref4) {
  var {
    points,
    baseLine,
    needClip,
    clipPathId,
    props
  } = _ref4;
  var {
    layout,
    type,
    stroke,
    connectNulls,
    isRange
  } = props;
  var {
    id
  } = props, propsWithoutId = _objectWithoutProperties(props, _excluded);
  var allOtherProps = svgPropertiesNoEvents(propsWithoutId);
  var propsWithEvents = svgPropertiesAndEvents(propsWithoutId);
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /* @__PURE__ */ reactExports.createElement(Layer, {
    clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : void 0
  }, /* @__PURE__ */ reactExports.createElement(Curve, _extends({}, propsWithEvents, {
    id,
    points,
    connectNulls,
    type,
    baseLine,
    layout,
    stroke: "none",
    className: "recharts-area-area"
  })), stroke !== "none" && /* @__PURE__ */ reactExports.createElement(Curve, _extends({}, allOtherProps, {
    className: "recharts-area-curve",
    layout,
    type,
    connectNulls,
    fill: "none",
    points
  })), stroke !== "none" && isRange && Array.isArray(baseLine) && /* @__PURE__ */ reactExports.createElement(Curve, _extends({}, allOtherProps, {
    className: "recharts-area-curve",
    layout,
    type,
    connectNulls,
    fill: "none",
    points: baseLine
  }))), /* @__PURE__ */ reactExports.createElement(AreaDotsWrapper, {
    points,
    props: propsWithoutId,
    clipPathId
  }));
}
function VerticalRect(_ref5) {
  var _points$, _points;
  var {
    alpha: alpha2,
    baseLine,
    points,
    strokeWidth
  } = _ref5;
  var startY = (_points$ = points[0]) === null || _points$ === void 0 ? void 0 : _points$.y;
  var endY = (_points = points[points.length - 1]) === null || _points === void 0 ? void 0 : _points.y;
  if (!isWellBehavedNumber(startY) || !isWellBehavedNumber(endY)) {
    return null;
  }
  var height = alpha2 * Math.abs(startY - endY);
  var maxX = Math.max(...points.map((entry) => entry.x || 0));
  if (isNumber(baseLine)) {
    maxX = Math.max(baseLine, maxX);
  } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
    maxX = Math.max(...baseLine.map((entry) => entry.x || 0), maxX);
  }
  if (isNumber(maxX)) {
    return /* @__PURE__ */ reactExports.createElement("rect", {
      x: 0,
      y: startY < endY ? startY : startY - height,
      width: maxX + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1),
      height: Math.floor(height)
    });
  }
  return null;
}
function HorizontalRect(_ref6) {
  var _points$2, _points2;
  var {
    alpha: alpha2,
    baseLine,
    points,
    strokeWidth
  } = _ref6;
  var startX = (_points$2 = points[0]) === null || _points$2 === void 0 ? void 0 : _points$2.x;
  var endX = (_points2 = points[points.length - 1]) === null || _points2 === void 0 ? void 0 : _points2.x;
  if (!isWellBehavedNumber(startX) || !isWellBehavedNumber(endX)) {
    return null;
  }
  var width = alpha2 * Math.abs(startX - endX);
  var maxY = Math.max(...points.map((entry) => entry.y || 0));
  if (isNumber(baseLine)) {
    maxY = Math.max(baseLine, maxY);
  } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
    maxY = Math.max(...baseLine.map((entry) => entry.y || 0), maxY);
  }
  if (isNumber(maxY)) {
    return /* @__PURE__ */ reactExports.createElement("rect", {
      x: startX < endX ? startX : startX - width,
      y: 0,
      width,
      height: Math.floor(maxY + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1))
    });
  }
  return null;
}
function ClipRect(_ref7) {
  var {
    alpha: alpha2,
    layout,
    points,
    baseLine,
    strokeWidth
  } = _ref7;
  if (layout === "vertical") {
    return /* @__PURE__ */ reactExports.createElement(VerticalRect, {
      alpha: alpha2,
      points,
      baseLine,
      strokeWidth
    });
  }
  return /* @__PURE__ */ reactExports.createElement(HorizontalRect, {
    alpha: alpha2,
    points,
    baseLine,
    strokeWidth
  });
}
function AreaWithAnimation(_ref8) {
  var {
    needClip,
    clipPathId,
    props,
    previousPointsRef,
    previousBaselineRef
  } = _ref8;
  var {
    points,
    baseLine,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    onAnimationStart,
    onAnimationEnd
  } = props;
  var animationInput = reactExports.useMemo(() => ({
    points,
    baseLine
  }), [points, baseLine]);
  var animationId = useAnimationId(animationInput, "recharts-area-");
  var layout = useCartesianChartLayout();
  var [isAnimating, setIsAnimating] = reactExports.useState(false);
  var showLabels = !isAnimating;
  var handleAnimationEnd = reactExports.useCallback(() => {
    if (typeof onAnimationEnd === "function") {
      onAnimationEnd();
    }
    setIsAnimating(false);
  }, [onAnimationEnd]);
  var handleAnimationStart = reactExports.useCallback(() => {
    if (typeof onAnimationStart === "function") {
      onAnimationStart();
    }
    setIsAnimating(true);
  }, [onAnimationStart]);
  if (layout == null) {
    return null;
  }
  var prevPoints = previousPointsRef.current;
  var prevBaseLine = previousBaselineRef.current;
  return /* @__PURE__ */ reactExports.createElement(AreaLabelListProvider, {
    showLabels,
    points
  }, props.children, /* @__PURE__ */ reactExports.createElement(JavascriptAnimate, {
    animationId,
    begin: animationBegin,
    duration: animationDuration,
    isActive: isAnimationActive,
    easing: animationEasing,
    onAnimationEnd: handleAnimationEnd,
    onAnimationStart: handleAnimationStart,
    key: animationId
  }, (t) => {
    if (prevPoints) {
      var prevPointsDiffFactor = prevPoints.length / points.length;
      var stepPoints = (
        /*
         * Here it is important that at the very end of the animation, on the last frame,
         * we render the original points without any interpolation.
         * This is needed because the code above is checking for reference equality to decide if the animation should run
         * and if we create a new array instance (even if the numbers were the same)
         * then we would break animations.
         */
        t === 1 ? points : points.map((entry, index) => {
          var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
          if (prevPoints[prevPointIndex]) {
            var prev = prevPoints[prevPointIndex];
            return _objectSpread(_objectSpread({}, entry), {}, {
              x: interpolate(prev.x, entry.x, t),
              y: interpolate(prev.y, entry.y, t)
            });
          }
          return entry;
        })
      );
      var stepBaseLine;
      if (isNumber(baseLine)) {
        stepBaseLine = interpolate(prevBaseLine, baseLine, t);
      } else if (isNullish(baseLine) || isNan(baseLine)) {
        stepBaseLine = interpolate(prevBaseLine, 0, t);
      } else {
        stepBaseLine = baseLine.map((entry, index) => {
          var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
          if (Array.isArray(prevBaseLine) && prevBaseLine[prevPointIndex]) {
            var prev = prevBaseLine[prevPointIndex];
            return _objectSpread(_objectSpread({}, entry), {}, {
              x: interpolate(prev.x, entry.x, t),
              y: interpolate(prev.y, entry.y, t)
            });
          }
          return entry;
        });
      }
      if (t > 0) {
        previousPointsRef.current = stepPoints;
        previousBaselineRef.current = stepBaseLine;
      }
      return /* @__PURE__ */ reactExports.createElement(StaticArea, {
        points: stepPoints,
        baseLine: stepBaseLine,
        needClip,
        clipPathId,
        props
      });
    }
    if (t > 0) {
      previousPointsRef.current = points;
      previousBaselineRef.current = baseLine;
    }
    return /* @__PURE__ */ reactExports.createElement(Layer, null, isAnimationActive && /* @__PURE__ */ reactExports.createElement("defs", null, /* @__PURE__ */ reactExports.createElement("clipPath", {
      id: "animationClipPath-".concat(clipPathId)
    }, /* @__PURE__ */ reactExports.createElement(ClipRect, {
      alpha: t,
      points,
      baseLine,
      layout,
      strokeWidth: props.strokeWidth
    }))), /* @__PURE__ */ reactExports.createElement(Layer, {
      clipPath: "url(#animationClipPath-".concat(clipPathId, ")")
    }, /* @__PURE__ */ reactExports.createElement(StaticArea, {
      points,
      baseLine,
      needClip,
      clipPathId,
      props
    })));
  }), /* @__PURE__ */ reactExports.createElement(LabelListFromLabelProp, {
    label: props.label
  }));
}
function RenderArea(_ref9) {
  var {
    needClip,
    clipPathId,
    props
  } = _ref9;
  var previousPointsRef = reactExports.useRef(null);
  var previousBaselineRef = reactExports.useRef();
  return /* @__PURE__ */ reactExports.createElement(AreaWithAnimation, {
    needClip,
    clipPathId,
    props,
    previousPointsRef,
    previousBaselineRef
  });
}
class AreaWithState extends reactExports.PureComponent {
  render() {
    var {
      hide,
      dot,
      points,
      className,
      top,
      left,
      needClip,
      xAxisId,
      yAxisId,
      width,
      height,
      id,
      baseLine,
      zIndex
    } = this.props;
    if (hide) {
      return null;
    }
    var layerClass = clsx("recharts-area", className);
    var clipPathId = id;
    var {
      r,
      strokeWidth
    } = getRadiusAndStrokeWidthFromDot(dot);
    var clipDot = isClipDot(dot);
    var dotSize = r * 2 + strokeWidth;
    var activePointsClipPath = needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : void 0;
    return /* @__PURE__ */ reactExports.createElement(ZIndexLayer, {
      zIndex
    }, /* @__PURE__ */ reactExports.createElement(Layer, {
      className: layerClass
    }, needClip && /* @__PURE__ */ reactExports.createElement("defs", null, /* @__PURE__ */ reactExports.createElement(GraphicalItemClipPath, {
      clipPathId,
      xAxisId,
      yAxisId
    }), !clipDot && /* @__PURE__ */ reactExports.createElement("clipPath", {
      id: "clipPath-dots-".concat(clipPathId)
    }, /* @__PURE__ */ reactExports.createElement("rect", {
      x: left - dotSize / 2,
      y: top - dotSize / 2,
      width: width + dotSize,
      height: height + dotSize
    }))), /* @__PURE__ */ reactExports.createElement(RenderArea, {
      needClip,
      clipPathId,
      props: this.props
    })), /* @__PURE__ */ reactExports.createElement(ActivePoints, {
      points,
      mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot,
      clipPath: activePointsClipPath
    }), this.props.isRange && Array.isArray(baseLine) && /* @__PURE__ */ reactExports.createElement(ActivePoints, {
      points: baseLine,
      mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot,
      clipPath: activePointsClipPath
    }));
  }
}
var defaultAreaProps = {
  activeDot: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease",
  connectNulls: false,
  dot: false,
  fill: "#3182bd",
  fillOpacity: 0.6,
  hide: false,
  isAnimationActive: "auto",
  legendType: "line",
  stroke: "#3182bd",
  strokeWidth: 1,
  type: "linear",
  label: false,
  xAxisId: 0,
  yAxisId: 0,
  zIndex: DefaultZIndexes.area
};
function AreaImpl(props) {
  var _useAppSelector;
  var {
    activeDot,
    animationBegin,
    animationDuration,
    animationEasing,
    connectNulls,
    dot,
    fill,
    fillOpacity,
    hide,
    isAnimationActive,
    legendType,
    stroke,
    xAxisId,
    yAxisId
  } = props, everythingElse = _objectWithoutProperties(props, _excluded2);
  var layout = useChartLayout();
  var chartName = useChartName();
  var {
    needClip
  } = useNeedsClip(xAxisId, yAxisId);
  var isPanorama = useIsPanorama();
  var {
    points,
    isRange,
    baseLine
  } = (_useAppSelector = useAppSelector((state) => selectArea(state, props.id, isPanorama))) !== null && _useAppSelector !== void 0 ? _useAppSelector : {};
  var plotArea = usePlotArea();
  if (layout !== "horizontal" && layout !== "vertical" || plotArea == null) {
    return null;
  }
  if (chartName !== "AreaChart" && chartName !== "ComposedChart") {
    return null;
  }
  var {
    height,
    width,
    x: left,
    y: top
  } = plotArea;
  if (!points || !points.length) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(AreaWithState, _extends({}, everythingElse, {
    activeDot,
    animationBegin,
    animationDuration,
    animationEasing,
    baseLine,
    connectNulls,
    dot,
    fill,
    fillOpacity,
    height,
    hide,
    layout,
    isAnimationActive,
    isRange,
    legendType,
    needClip,
    points,
    stroke,
    width,
    left,
    top,
    xAxisId,
    yAxisId
  }));
}
var getBaseValue = (layout, chartBaseValue, itemBaseValue, xAxis, yAxis) => {
  var baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
  if (isNumber(baseValue)) {
    return baseValue;
  }
  var numericAxis = layout === "horizontal" ? yAxis : xAxis;
  var domain = numericAxis.scale.domain();
  if (numericAxis.type === "number") {
    var domainMax = Math.max(domain[0], domain[1]);
    var domainMin = Math.min(domain[0], domain[1]);
    if (baseValue === "dataMin") {
      return domainMin;
    }
    if (baseValue === "dataMax") {
      return domainMax;
    }
    return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
  }
  if (baseValue === "dataMin") {
    return domain[0];
  }
  if (baseValue === "dataMax") {
    return domain[1];
  }
  return domain[0];
};
function computeArea(_ref0) {
  var {
    areaSettings: {
      connectNulls,
      baseValue: itemBaseValue,
      dataKey
    },
    stackedData,
    layout,
    chartBaseValue,
    xAxis,
    yAxis,
    displayedData,
    dataStartIndex,
    xAxisTicks,
    yAxisTicks,
    bandSize
  } = _ref0;
  var hasStack = stackedData && stackedData.length;
  var baseValue = getBaseValue(layout, chartBaseValue, itemBaseValue, xAxis, yAxis);
  var isHorizontalLayout = layout === "horizontal";
  var isRange = false;
  var points = displayedData.map((entry, index) => {
    var _valueAsArray$, _valueAsArray, _xAxis$scale$map;
    var valueAsArray;
    if (hasStack) {
      valueAsArray = stackedData[dataStartIndex + index];
    } else {
      var rawValue = getValueByDataKey(entry, dataKey);
      if (!Array.isArray(rawValue)) {
        valueAsArray = [baseValue, rawValue];
      } else {
        valueAsArray = rawValue;
        isRange = true;
      }
    }
    var value1 = (_valueAsArray$ = (_valueAsArray = valueAsArray) === null || _valueAsArray === void 0 ? void 0 : _valueAsArray[1]) !== null && _valueAsArray$ !== void 0 ? _valueAsArray$ : null;
    var isBreakPoint = value1 == null || hasStack && !connectNulls && getValueByDataKey(entry, dataKey) == null;
    if (isHorizontalLayout) {
      var _yAxis$scale$map;
      return {
        x: getCateCoordinateOfLine({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: isBreakPoint ? null : (_yAxis$scale$map = yAxis.scale.map(value1)) !== null && _yAxis$scale$map !== void 0 ? _yAxis$scale$map : null,
        value: valueAsArray,
        payload: entry
      };
    }
    return {
      x: isBreakPoint ? null : (_xAxis$scale$map = xAxis.scale.map(value1)) !== null && _xAxis$scale$map !== void 0 ? _xAxis$scale$map : null,
      y: getCateCoordinateOfLine({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        entry,
        index
      }),
      value: valueAsArray,
      payload: entry
    };
  });
  var baseLine;
  if (hasStack || isRange) {
    baseLine = points.map((entry) => {
      var _xAxis$scale$map2;
      var x = Array.isArray(entry.value) ? entry.value[0] : null;
      if (isHorizontalLayout) {
        var _yAxis$scale$map2;
        return {
          x: entry.x,
          y: x != null && entry.y != null ? (_yAxis$scale$map2 = yAxis.scale.map(x)) !== null && _yAxis$scale$map2 !== void 0 ? _yAxis$scale$map2 : null : null,
          payload: entry.payload
        };
      }
      return {
        x: x != null ? (_xAxis$scale$map2 = xAxis.scale.map(x)) !== null && _xAxis$scale$map2 !== void 0 ? _xAxis$scale$map2 : null : null,
        y: entry.y,
        payload: entry.payload
      };
    });
  } else {
    baseLine = isHorizontalLayout ? yAxis.scale.map(baseValue) : xAxis.scale.map(baseValue);
  }
  return {
    points,
    baseLine: baseLine !== null && baseLine !== void 0 ? baseLine : 0,
    isRange
  };
}
function AreaFn(outsideProps) {
  var props = resolveDefaultProps(outsideProps, defaultAreaProps);
  var isPanorama = useIsPanorama();
  return /* @__PURE__ */ reactExports.createElement(RegisterGraphicalItemId, {
    id: props.id,
    type: "area"
  }, (id) => /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(SetLegendPayload, {
    legendPayload: computeLegendPayloadFromAreaData(props)
  }), /* @__PURE__ */ reactExports.createElement(SetAreaTooltipEntrySettings, {
    dataKey: props.dataKey,
    data: props.data,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    name: props.name,
    hide: props.hide,
    unit: props.unit,
    tooltipType: props.tooltipType,
    id
  }), /* @__PURE__ */ reactExports.createElement(SetCartesianGraphicalItem, {
    type: "area",
    id,
    data: props.data,
    dataKey: props.dataKey,
    xAxisId: props.xAxisId,
    yAxisId: props.yAxisId,
    zAxisId: 0,
    stackId: getNormalizedStackId(props.stackId),
    hide: props.hide,
    barSize: void 0,
    baseValue: props.baseValue,
    isPanorama,
    connectNulls: props.connectNulls
  }), /* @__PURE__ */ reactExports.createElement(AreaImpl, _extends({}, props, {
    id
  }))));
}
var Area = /* @__PURE__ */ reactExports.memo(AreaFn, propsAreEqual);
Area.displayName = "Area";
var allowedTooltipTypes$1 = ["axis"];
var AreaChart = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  return /* @__PURE__ */ reactExports.createElement(CartesianChart, {
    chartName: "AreaChart",
    defaultTooltipEventType: "axis",
    validateTooltipEventTypes: allowedTooltipTypes$1,
    tooltipPayloadSearcher: arrayTooltipSearcher,
    categoricalChartProps: props,
    ref
  });
});
var allowedTooltipTypes = ["axis"];
var ComposedChart = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  return /* @__PURE__ */ reactExports.createElement(CartesianChart, {
    chartName: "ComposedChart",
    defaultTooltipEventType: "axis",
    validateTooltipEventTypes: allowedTooltipTypes,
    tooltipPayloadSearcher: arrayTooltipSearcher,
    categoricalChartProps: props,
    ref
  });
});
const colors = {
  primary: "#0378A6",
  secondary: "#8dbf41",
  accent: "#bf0404",
  warning: "#f59e0b",
  text: {
    primary: "#0f172a",
    secondary: "#334155"
  },
  chart: {
    bar1: "#0378A6",
    bar2: "#8dbf41",
    pie1: "#0378A6",
    pie2: "#8dbf41",
    pie3: "#f59e0b",
    pie4: "#bf0404",
    pie5: "#4aa3d9",
    line1: "#0378A6",
    line2: "#8dbf41",
    area1: "rgba(3, 120, 166, 0.3)",
    area2: "rgba(141, 191, 65, 0.3)"
  }
};
const CollectorDashboardRecharts = ({ isMobile = false }) => {
  const theme = useTheme();
  theme.palette.mode === "dark";
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const getChartDimensions = () => {
    if (isMobile) {
      return { height: 250, outerRadius: 80, innerRadius: 40 };
    }
    if (isTablet) {
      return { height: 280, outerRadius: 100, innerRadius: 50 };
    }
    return { height: 300, outerRadius: 120, innerRadius: 60 };
  };
  const { height, outerRadius, innerRadius } = getChartDimensions();
  const monthlyPerformanceData = [
    { month: "Jan", allocated: 85, resolved: 65, collected: 95e3, target: 1e5 },
    { month: "Feb", allocated: 92, resolved: 78, collected: 112e3, target: 11e4 },
    { month: "Mar", allocated: 88, resolved: 82, collected: 128e3, target: 12e4 },
    { month: "Apr", allocated: 95, resolved: 85, collected: 135e3, target: 13e4 },
    { month: "May", allocated: 90, resolved: 88, collected: 142e3, target: 14e4 },
    { month: "Jun", allocated: 98, resolved: 92, collected: 158e3, target: 15e4 }
  ];
  const bucketDistributionData = [
    { name: "Bucket 1", value: 245, color: colors.chart.pie1, percentage: 35 },
    { name: "Bucket 2", value: 180, color: colors.chart.pie2, percentage: 26 },
    { name: "Bucket 3", value: 135, color: colors.chart.pie3, percentage: 19 },
    { name: "Bucket 4", value: 95, color: colors.chart.pie4, percentage: 14 },
    { name: "Bucket 5", value: 45, color: colors.chart.pie5, percentage: 6 }
  ];
  const weeklyTrendData = [
    { day: "Mon", calls: 45, promises: 32, collections: 85e3 },
    { day: "Tue", calls: 52, promises: 41, collections: 92e3 },
    { day: "Wed", calls: 48, promises: 38, collections: 88e3 },
    { day: "Thu", calls: 55, promises: 45, collections: 105e3 },
    { day: "Fri", calls: 60, promises: 52, collections: 118e3 },
    { day: "Sat", calls: 42, promises: 35, collections: 78e3 }
  ];
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Paper, { sx: {
        p: 1.5,
        backgroundColor: alpha("#ffffff", 0.95),
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        boxShadow: `0 4px 12px ${colors.primary}20`
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: { fontWeight: 600, color: colors.text.primary }, children: label }),
        payload.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", sx: {
          display: "block",
          color: entry.color,
          mt: 0.5
        }, children: `${entry.name}: ${entry.name.includes("₹") || entry.name.includes("Amount") ? `₹${entry.value.toLocaleString("en-IN")}` : entry.value}` }, index))
      ] });
    }
    return null;
  };
  const formatCurrency = (value) => `₹${value.toLocaleString("en-IN")}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: {
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? 2 : 3
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
      gap: isMobile ? 2 : 3
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Paper, { sx: {
        p: isMobile ? 2 : 3,
        backgroundColor: alpha("#ffffff", 0.9),
        borderRadius: 3,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 8px 20px ${colors.primary}15`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 16px 30px ${colors.primary}25`
        }
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: {
          mb: 2,
          fontSize: isMobile ? 16 : 18,
          fontWeight: 600,
          color: colors.text.primary,
          borderBottom: `2px solid ${colors.primary}`,
          pb: 1,
          display: "inline-block"
        }, children: "Monthly Collection Performance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "100%", height }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ComposedChart, { data: monthlyPerformanceData, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: colors.border }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            XAxis,
            {
              dataKey: "month",
              tick: { fontSize: isMobile ? 10 : 12, fill: colors.text.secondary }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            YAxis,
            {
              yAxisId: "left",
              tick: { fontSize: isMobile ? 10 : 12, fill: colors.text.secondary },
              tickFormatter: (value) => `${value}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            YAxis,
            {
              yAxisId: "right",
              orientation: "right",
              tick: { fontSize: isMobile ? 10 : 12, fill: colors.text.secondary },
              tickFormatter: formatCurrency
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Legend,
            {
              wrapperStyle: { fontSize: isMobile ? 10 : 12, paddingTop: 10 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Bar,
            {
              yAxisId: "left",
              dataKey: "allocated",
              fill: colors.chart.bar1,
              name: "Accounts Allocated",
              radius: [4, 4, 0, 0],
              barSize: isMobile ? 12 : 16
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Bar,
            {
              yAxisId: "left",
              dataKey: "resolved",
              fill: colors.chart.bar2,
              name: "Accounts Resolved",
              radius: [4, 4, 0, 0],
              barSize: isMobile ? 12 : 16
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Line,
            {
              yAxisId: "right",
              type: "monotone",
              dataKey: "collected",
              stroke: colors.accent,
              name: "Amount Collected",
              strokeWidth: 3,
              dot: { r: 4, fill: colors.accent }
            }
          )
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Paper, { sx: {
        p: isMobile ? 2 : 3,
        backgroundColor: alpha("#ffffff", 0.9),
        borderRadius: 3,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 8px 20px ${colors.primary}15`,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 16px 30px ${colors.primary}25`
        }
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: {
          mb: 2,
          fontSize: isMobile ? 16 : 18,
          fontWeight: 600,
          color: colors.text.primary,
          borderBottom: `2px solid ${colors.secondary}`,
          pb: 1,
          display: "inline-block"
        }, children: "Account Distribution by Bucket" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "100%", height }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Pie,
            {
              data: bucketDistributionData,
              cx: "50%",
              cy: "50%",
              labelLine: !isMobile,
              outerRadius,
              innerRadius,
              fill: "#8884d8",
              dataKey: "value",
              label: !isMobile ? ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)` : null,
              paddingAngle: 2,
              children: bucketDistributionData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.color }, `cell-${index}`))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
          !isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {})
        ] }) }) }),
        isMobile && /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }, children: bucketDistributionData.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: {
          display: "flex",
          alignItems: "center",
          mr: 2,
          mb: 1
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
            width: 12,
            height: 12,
            backgroundColor: item.color,
            borderRadius: "50%",
            mr: 0.5
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", sx: { color: colors.text.secondary }, children: [
            item.name,
            " (",
            item.percentage,
            "%)"
          ] })
        ] }, index)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Paper, { sx: {
      p: isMobile ? 2 : 3,
      backgroundColor: alpha("#ffffff", 0.9),
      borderRadius: 3,
      border: `1px solid ${colors.border}`,
      boxShadow: `0 8px 20px ${colors.primary}15`,
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: `0 16px 30px ${colors.primary}25`
      }
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: {
        mb: 2,
        fontSize: isMobile ? 16 : 18,
        fontWeight: 600,
        color: colors.text.primary,
        borderBottom: `2px solid ${colors.warning}`,
        pb: 1,
        display: "inline-block"
      }, children: "Weekly Collection Trend" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { width: "100%", height }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, { data: weeklyTrendData, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: colors.border }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          XAxis,
          {
            dataKey: "day",
            tick: { fontSize: isMobile ? 10 : 12, fill: colors.text.secondary }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          YAxis,
          {
            yAxisId: "left",
            tick: { fontSize: isMobile ? 10 : 12, fill: colors.text.secondary }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          YAxis,
          {
            yAxisId: "right",
            orientation: "right",
            tick: { fontSize: isMobile ? 10 : 12, fill: colors.text.secondary },
            tickFormatter: formatCurrency
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { content: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomTooltip, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Legend,
          {
            wrapperStyle: { fontSize: isMobile ? 10 : 12, paddingTop: 10 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Area,
          {
            yAxisId: "left",
            type: "monotone",
            dataKey: "calls",
            stackId: "1",
            stroke: colors.chart.line1,
            fill: colors.chart.area1,
            name: "Calls Made"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Area,
          {
            yAxisId: "left",
            type: "monotone",
            dataKey: "promises",
            stackId: "1",
            stroke: colors.chart.line2,
            fill: colors.chart.area2,
            name: "Promises Received"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Line,
          {
            yAxisId: "right",
            type: "monotone",
            dataKey: "collections",
            stroke: colors.accent,
            name: "Collections (₹)",
            strokeWidth: 3,
            dot: { r: 4, fill: colors.accent }
          }
        )
      ] }) }) })
    ] })
  ] });
};
const DEFAULT_SORT_RULE = {
  id: "1",
  field: "",
  order: "asc"
};
const getSavedSortId = (sort) => (sort == null ? void 0 : sort.listViewCode) || (sort == null ? void 0 : sort.viewCode) || (sort == null ? void 0 : sort.listViewName) || (sort == null ? void 0 : sort.viewName) || "";
const getSavedSortName = (sort) => (sort == null ? void 0 : sort.listViewName) || (sort == null ? void 0 : sort.viewName) || getSavedSortId(sort);
const buildSortPayload = ({ sortName, sortRules = [] }) => {
  const payload = [];
  const addEntry = (key, order = "asc") => {
    const normalizedKey = String(key ?? "").trim();
    if (!normalizedKey) return;
    payload.push({ key, order });
  };
  sortRules.forEach((rule) => {
    const field = String((rule == null ? void 0 : rule.field) ?? "").trim();
    const order = String((rule == null ? void 0 : rule.order) ?? "asc").trim();
    if (!field) return;
    addEntry(field, order);
  });
  return {
    sortName: String(sortName ?? "").trim(),
    sorts: payload.filter((entry) => entry == null ? void 0 : entry.key)
  };
};
const SortPanel = ({
  colors: colors2,
  isMobile,
  panelThemeVars,
  sortRules = [],
  onSortRuleChange,
  onAddSortRule,
  onRemoveSortRule,
  onClose,
  onClear = () => {
  },
  onSaveSort = () => {
  },
  onApplySort = () => {
  },
  isLoading = false,
  savedSorts = [],
  attributes = [],
  toast = null,
  onDeleteSavedSort = () => {
  },
  entityAttributes = [],
  onReplaceSortRules = null
}) => {
  var _a;
  const [sortName, setSortName] = reactExports.useState("");
  const [selectedSavedSortId, setSelectedSavedSortId] = reactExports.useState("");
  const [localAddedSorts, setLocalAddedSorts] = reactExports.useState([]);
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const hasSortName = Boolean(String(sortName ?? "").trim());
  const handleLoadSavedSort = reactExports.useCallback((sortData) => {
    if (!sortData) return;
    try {
      let sorts = sortData.sortJson;
      if (typeof sorts === "string") {
        sorts = JSON.parse(sorts);
      }
      const sortArray = sorts.sortJson || sorts;
      if (!Array.isArray(sortArray)) return;
      const newRules = [];
      let ruleIndex = 0;
      sortArray.forEach((sort) => {
        const { key, order } = sort;
        if (!key) return;
        newRules.push({
          id: ruleIndex === 0 ? DEFAULT_SORT_RULE.id : `${Date.now()}-${ruleIndex}`,
          field: key.toUpperCase(),
          order: order || "asc"
        });
        ruleIndex++;
      });
      if (typeof onReplaceSortRules === "function") {
        onReplaceSortRules(newRules);
        return;
      }
      if (newRules.length > 0) {
        newRules.forEach((rule, idx) => {
          if (idx === 0) {
            onSortRuleChange(rule.id, "field", rule.field);
            onSortRuleChange(rule.id, "order", rule.order);
          } else {
            onAddSortRule();
          }
        });
      } else {
        if (sortRules.length > 0 && sortRules[0]) {
          onSortRuleChange(sortRules[0].id, "field", "");
          onSortRuleChange(sortRules[0].id, "order", "asc");
        }
      }
    } catch (error) {
      console.error("Failed to parse saved sort:", error);
    }
  }, [onReplaceSortRules, onSortRuleChange, onAddSortRule, sortRules]);
  const handleSaveSort = async () => {
    const trimmedName = String(sortName ?? "").trim();
    if (!trimmedName) return;
    const payload = buildSortPayload({ sortName: trimmedName, sortRules });
    const viewCode = trimmedName.toUpperCase().trim().replace(/\s+/g, "_");
    const dataBody = {
      listId: "ACLST",
      userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
      moduleName: "COL",
      viewCode: "ACLST_DEF",
      viewName: trimmedName,
      sortJson: (payload == null ? void 0 : payload.sorts) || [],
      filterJson: [],
      pageNumber: 1,
      pageSize: 100
    };
    try {
      const response = await Kr.POST(ColListingAPI.ListView(screenMenuId), dataBody);
      const newSort = {
        listViewCode: viewCode,
        viewCode,
        viewName: trimmedName,
        listViewName: trimmedName,
        sortJson: (payload == null ? void 0 : payload.sorts) || []
      };
      setLocalAddedSorts((prev) => [...prev, newSort]);
      setSelectedSavedSortId(viewCode);
      setSortName("");
      toast.success("Sort saved successfully");
    } catch (error) {
      console.error("Failed to save sort:", error);
      toast.error("Failed to save sort");
    }
  };
  const handleDeleteSort = async () => {
    var _a2;
    if (!selectedSavedSortId) return;
    try {
      const allSorts = [...savedSorts, ...localAddedSorts];
      const selectedSort = allSorts.find((s) => getSavedSortId(s) === selectedSavedSortId);
      if (!selectedSort) return;
      const dataBody = {
        listId: "ACLST",
        userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
        moduleName: "COL",
        viewCode: selectedSavedSortId,
        viewName: "",
        sortJson: [],
        filterJson: [],
        pageNumber: 1,
        pageSize: 100
      };
      const response = await Kr.DELETE(ColListingAPI.ListView(screenMenuId), dataBody);
      if (((_a2 = response == null ? void 0 : response.data) == null ? void 0 : _a2.status) === "SUCCESS") {
        onDeleteSavedSort(selectedSavedSortId);
        setSelectedSavedSortId("");
        toast.success("Sort deleted successfully");
      } else {
        toast.error("Failed to delete sort");
      }
    } catch (error) {
      console.error("Failed to delete sort:", error);
      toast.error("Error deleting sort");
    }
  };
  const sectionTitleStyles = {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "var(--drs-text-tertiary, hsl(215, 25%, 27%))",
    fontFamily: "'Inter', sans-serif"
  };
  const sectionBodyStyles = {
    fontSize: 11,
    color: colors2.text.secondary,
    fontFamily: "'Inter', sans-serif"
  };
  const sortFieldOptions = reactExports.useMemo(
    () => (Array.isArray(attributes) ? attributes : []).filter((attr) => String((attr == null ? void 0 : attr.szType) || "").includes("S") && String((attr == null ? void 0 : attr.szAttributeCode) || "").trim()).map((attr) => ({ label: attr.szAttributeDesc || attr.szAttributeCode, value: attr.szAttributeCode })),
    [attributes]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      className: "drs-panel-container",
      sx: {
        ...panelThemeVars,
        px: isMobile ? 1.5 : 2,
        py: 2,
        borderBottom: `1px solid var(--drs-border-divider, ${colors2.border})`,
        backgroundColor: "var(--drs-bg-panel, #f8fafc)",
        flexShrink: 0
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
              mb: 2
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { minWidth: 0, flex: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "Sort Options", translate: false, align: "left", colon: false, sx: sectionTitleStyles }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: "Define sort rules to organize the account list by multiple fields.",
                    translate: false,
                    align: "left",
                    colon: false,
                    sx: sectionBodyStyles
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }, children: [
                (savedSorts.length > 0 || localAddedSorts.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Dt,
                  {
                    sx: {
                      p: 0.5,
                      borderRadius: "10px",
                      border: "none",
                      backgroundColor: "transparent",
                      minWidth: 300,
                      maxWidth: 340,
                      flexShrink: 0
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SE,
                        {
                          options: [
                            { label: "Select a saved sort...", value: "" },
                            ...[...savedSorts, ...localAddedSorts].map((sort) => ({
                              label: getSavedSortName(sort),
                              value: getSavedSortId(sort)
                            }))
                          ],
                          value: selectedSavedSortId,
                          onChange: (event) => {
                            const sortId = event.target.value;
                            setSelectedSavedSortId(sortId);
                            if (sortId) {
                              const allSorts = [...savedSorts, ...localAddedSorts];
                              const selectedSort = allSorts.find((s) => getSavedSortId(s) === sortId);
                              if (selectedSort) {
                                handleLoadSavedSort(selectedSort);
                              }
                            }
                          },
                          placeholder: "Select a saved sort...",
                          width: "88%"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip$1, { title: "Delete selected sort", arrow: true, placement: "top", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        IconButton,
                        {
                          onClick: handleDeleteSort,
                          disabled: !selectedSavedSortId,
                          size: "small",
                          sx: {
                            color: colors2.accent,
                            "&:hover": {
                              backgroundColor: withAlpha(colors2.accent, 0.1)
                            },
                            "&.Mui-disabled": {
                              color: colors2.text.light
                            }
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(FiTrash2, { size: 16 })
                        }
                      ) }) })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: onClose, size: "small", sx: { color: colors2.text.light }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FiX, { size: 16 }) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { borderColor: colors2.border, mb: 2 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "SORT RULES", translate: false, align: "left", colon: false, sx: sectionTitleStyles }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Lg,
              {
                label: "Add Sort Rule",
                variant: "outlined",
                size: "small",
                inline: true,
                onClick: onAddSortRule,
                startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(FiPlus, { size: 13 }),
                sx: { textTransform: "none" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stack, { spacing: 1, children: sortRules.map((rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Dt,
            {
              sx: {
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 36px",
                gap: 0.5,
                alignItems: "center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SE,
                  {
                    options: [{ label: "Select field", value: "" }, ...sortFieldOptions],
                    value: rule.field,
                    onChange: (event) => onSortRuleChange(rule.id, "field", event.target.value),
                    placeholder: "Field",
                    width: "100%"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(ButtonGroup, { size: "small", "aria-label": "sort order", sx: { display: "flex", gap: 0, minWidth: 0 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Lg,
                    {
                      label: "Ascending",
                      variant: rule.order === "asc" ? "contained" : "outlined",
                      size: "small",
                      inline: true,
                      onClick: () => onSortRuleChange(rule.id, "order", "asc"),
                      sx: {
                        textTransform: "none",
                        fontSize: 11,
                        minWidth: 0,
                        flex: 1,
                        borderRadius: "6px 0 0 6px",
                        backgroundColor: rule.order === "asc" ? "var(--drs-accent, #3b82f6)" : "transparent",
                        color: rule.order === "asc" ? "white" : "var(--drs-text-primary, #0f172a)",
                        borderColor: "var(--drs-border-default, #e2e8f0)",
                        "&:hover": {
                          backgroundColor: rule.order === "asc" ? "var(--drs-accent, #3b82f6)" : "var(--drs-bg-hover, #f1f5f9)"
                        }
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Lg,
                    {
                      label: "Descending",
                      variant: rule.order === "desc" ? "contained" : "outlined",
                      size: "small",
                      inline: true,
                      onClick: () => onSortRuleChange(rule.id, "order", "desc"),
                      sx: {
                        textTransform: "none",
                        fontSize: 11,
                        minWidth: 0,
                        flex: 1,
                        borderRadius: "0 6px 6px 0",
                        backgroundColor: rule.order === "desc" ? "var(--drs-accent, #3b82f6)" : "transparent",
                        color: rule.order === "desc" ? "white" : "var(--drs-text-primary, #0f172a)",
                        borderColor: "var(--drs-border-default, #e2e8f0)",
                        "&:hover": {
                          backgroundColor: rule.order === "desc" ? "var(--drs-accent, #3b82f6)" : "var(--drs-bg-hover, #f1f5f9)"
                        }
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  IconButton,
                  {
                    onClick: () => onRemoveSortRule(rule.id),
                    disabled: sortRules.length === 1,
                    size: "small",
                    sx: { color: colors2.text.light },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(FiTrash2, { size: 14 })
                  }
                )
              ]
            },
            rule.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { borderColor: colors2.border, my: 1 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              p: 1.25,
              borderRadius: "12px",
              width: "100%",
              maxWidth: 650,
              display: "flex",
              flexDirection: "column",
              gap: 0.75
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "Save Sort", translate: false, align: "left", colon: false, sx: sectionTitleStyles }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { display: "flex", alignItems: "flex-start", gap: 3, width: "100%", flexWrap: "wrap" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 0.5, flex: 1, minWidth: 260 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "Sort Name", translate: false, align: "left", colon: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "flex-start", gap: 1 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ap,
                    {
                      editable: true,
                      width: "100%",
                      value: sortName,
                      onChange: (event) => setSortName(event.target.value),
                      placeholder: "Enter sort name"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Lg,
                    {
                      label: "Save",
                      variant: "contained",
                      size: "small",
                      inline: true,
                      onClick: handleSaveSort,
                      disabled: !hasSortName,
                      startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(SaveIcon, {}),
                      sx: { minWidth: 90, height: 30, flexShrink: 0 }
                    }
                  )
                ] })
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { borderColor: colors2.border, my: 1 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%", gap: 1.25, mt: 1, marginLeft: "auto", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Lg,
            {
              label: "Apply Sort",
              variant: "contained",
              size: "small",
              inline: true,
              onClick: onApplySort,
              disabled: isLoading,
              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchIcon, {}),
              sx: { height: 36, textTransform: "none" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Lg,
            {
              label: "Clear",
              variant: "outlined",
              size: "small",
              inline: true,
              onClick: onClear,
              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(BackspaceIcon, {}),
              sx: { height: 36, textTransform: "none", borderColor: colors2.border }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Lg,
            {
              label: "Close",
              variant: "outlined",
              color: "error",
              size: "small",
              inline: true,
              onClick: onClose,
              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, {}),
              sx: { height: 36, textTransform: "none" }
            }
          )
        ] })
      ]
    }
  );
};
const SortPanel$1 = React.memo(SortPanel);
const DEFAULT_ADVANCED_FILTERS$1 = {
  portfolio: "",
  bucket: "",
  status: ""
};
const DEFAULT_ADVANCED_RULE$1 = {
  id: "1",
  connector: "AND",
  field: "",
  operator: "=",
  value: ""
};
const getSavedFilterId$1 = (filter) => (filter == null ? void 0 : filter.listViewCode) || (filter == null ? void 0 : filter.viewCode) || (filter == null ? void 0 : filter.listViewName) || (filter == null ? void 0 : filter.viewName) || "";
const getSavedFilterName$1 = (filter) => (filter == null ? void 0 : filter.listViewName) || (filter == null ? void 0 : filter.viewName) || getSavedFilterId$1(filter);
const buildFilterPayload = ({ filterName, advancedFilters = {}, rules = [], entityAttributes = [] }) => {
  const payload = [];
  const getFilterOperator = (operator) => {
    switch (operator) {
      case "LIKE":
        return "LIKE";
      case "is":
        return "EQUALS";
      case "is_not":
        return "NOT_EQUALS";
      case "gt":
        return "GREATER_THAN";
      case "lt":
        return "LESS_THAN";
      default:
        return operator || "=";
    }
  };
  const addEntry = (key, value, opt = "=", meta = null, condition = null) => {
    const normalizedValue = String(value ?? "").trim();
    if (!key || !normalizedValue) return;
    if ((meta == null ? void 0 : meta.controlType) === "Checkbox" && normalizedValue !== "Y") {
      return;
    }
    const normalizedCondition = String(condition ?? "").trim().toUpperCase();
    const isValidCondition = normalizedCondition === "AND" || normalizedCondition === "OR";
    payload.push({
      key,
      opt,
      value: normalizedValue,
      ...isValidCondition ? { condition: normalizedCondition } : {}
    });
  };
  const attributeKeySet = new Set(
    (Array.isArray(entityAttributes) ? entityAttributes : []).map((attr) => String((attr == null ? void 0 : attr.szAttributeCode) || "").trim()).filter(Boolean)
  );
  const attributeMetaMap = new Map(
    (Array.isArray(entityAttributes) ? entityAttributes : []).map((attr) => [
      String((attr == null ? void 0 : attr.szAttributeCode) || "").trim(),
      { controlType: String((attr == null ? void 0 : attr.szControlType) || "").trim() || null }
    ])
  );
  Object.entries(advancedFilters || {}).forEach(([key, value]) => {
    const apiKey = attributeKeySet.has(String(key).trim()) ? String(key).trim() : String(key).trim();
    const operator = "=";
    addEntry(apiKey, value, operator, attributeMetaMap.get(apiKey));
  });
  rules.forEach((rule) => {
    const key = String((rule == null ? void 0 : rule.field) ?? "").trim();
    const value = String((rule == null ? void 0 : rule.value) ?? "").trim();
    if (!key || !value) return;
    addEntry(key, value, getFilterOperator(rule == null ? void 0 : rule.operator), null, (rule == null ? void 0 : rule.connector) || "AND");
  });
  return {
    filterName: String(filterName ?? "").trim(),
    filters: payload.filter((entry) => (entry == null ? void 0 : entry.key) && (entry == null ? void 0 : entry.value) !== void 0)
  };
};
const AdvancedSearchPanel = ({
  colors: colors2,
  isMobile,
  panelThemeVars,
  advancedFilters,
  onAdvancedFilterChange,
  rules,
  onRuleChange,
  onAddRule,
  onRemoveRule,
  onReset,
  onClear,
  onClose,
  onSaveFilter = () => {
  },
  onSearch = () => {
  },
  sortRules = [],
  onSortRuleChange = () => {
  },
  onAddSortRule = () => {
  },
  onRemoveSortRule = () => {
  },
  searchCriteriaCount = false,
  isLoading = false,
  savedFilters = [],
  attributes = [],
  toast = null,
  onDeleteSavedFilter = () => {
  },
  entityAttributes = [],
  onApplySavedFilter = null
}) => {
  var _a;
  const [filterName, setFilterName] = reactExports.useState("");
  const [selectedUsers, setSelectedUsers] = reactExports.useState([]);
  const [userOptions, setUserOptions] = reactExports.useState([]);
  const [selectedSavedFilterId, setSelectedSavedFilterId] = reactExports.useState("");
  const [localAddedFilters, setLocalAddedFilters] = reactExports.useState([]);
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const hasFilterName = Boolean(String(filterName ?? "").trim());
  const dynamicFilters = reactExports.useMemo(() => {
    if (!Array.isArray(entityAttributes)) return {};
    const filters = {};
    entityAttributes.forEach((attr) => {
      var _a2;
      if ((_a2 = attr == null ? void 0 : attr.szType) == null ? void 0 : _a2.includes("Q")) {
        const code = (attr == null ? void 0 : attr.szAttributeCode) || "";
        const desc = (attr == null ? void 0 : attr.szAttributeDesc) || "";
        const controlType = String((attr == null ? void 0 : attr.szControlType) || "").trim();
        const searchCode = String((attr == null ? void 0 : attr.szSearchCode) || "").trim();
        if (!filters[code]) {
          filters[code] = {
            code,
            desc,
            controlType,
            searchCode,
            values: []
            // Will be populated if it's a dropdown type
          };
        }
      }
    });
    return filters;
  }, [entityAttributes]);
  const handleLoadSavedFilter = reactExports.useCallback((filterData) => {
    if (!filterData) return;
    try {
      let filters = filterData.filterJson;
      if (typeof filters === "string") {
        filters = JSON.parse(filters);
      }
      const filterArray = filters.filterJson || filters;
      if (!Array.isArray(filterArray)) return;
      const dynamicFilterCodes = new Set(
        (Array.isArray(entityAttributes) ? entityAttributes : []).filter((attr) => String((attr == null ? void 0 : attr.szType) || "").includes("A")).map((attr) => String((attr == null ? void 0 : attr.szAttributeCode) || "").trim()).filter(Boolean)
      );
      const newFilters = { ...DEFAULT_ADVANCED_FILTERS$1 };
      const newRules = [];
      let ruleIndex = 0;
      filterArray.forEach((filter) => {
        var _a2;
        const { key, opt, value, condition, connector } = filter || {};
        const normalizedKey = String(key ?? "").trim();
        const resolvedKey = ((_a2 = (Array.isArray(entityAttributes) ? entityAttributes : []).find(
          (attr) => String((attr == null ? void 0 : attr.szAttributeCode) || "").trim().toLowerCase() === normalizedKey.toLowerCase() || String((attr == null ? void 0 : attr.szAttributeDesc) || "").trim().toLowerCase() === normalizedKey.toLowerCase()
        )) == null ? void 0 : _a2.szAttributeCode) || normalizedKey;
        const normalizedOpt = String(opt ?? "").trim().toUpperCase();
        const isNormalFilterOperator = !opt || ["=", "EQUALS"].includes(normalizedOpt) || normalizedOpt === "=";
        if (isNormalFilterOperator) {
          newFilters[resolvedKey] = value;
          return;
        }
        newRules.push({
          id: ruleIndex === 0 ? DEFAULT_ADVANCED_RULE$1.id : `${Date.now()}-${ruleIndex}`,
          connector: ["AND", "OR"].includes(String(condition || connector || "").toUpperCase()) ? String(condition || connector).toUpperCase() : "AND",
          field: resolvedKey.toUpperCase(),
          operator: getUIOperator(opt),
          value
        });
        ruleIndex++;
      });
      Object.entries(newFilters).forEach(([filterKey, filterValue]) => {
        onAdvancedFilterChange(filterKey, filterValue);
      });
      if (newRules.length > 0) {
        newRules.forEach((rule, idx) => {
          if (idx === 0) {
            onRuleChange(rule.id, "field", rule.field);
            onRuleChange(rule.id, "operator", rule.operator);
            onRuleChange(rule.id, "value", rule.value);
          } else {
            onAddRule();
          }
        });
      } else {
        if (rules.length > 0 && rules[0]) {
          onRuleChange(rules[0].id, "field", "");
          onRuleChange(rules[0].id, "operator", "=");
          onRuleChange(rules[0].id, "value", "");
        }
      }
    } catch (error) {
      console.error("Failed to parse saved filter:", error);
    }
  }, [onAdvancedFilterChange, onAddRule, onRuleChange, rules, entityAttributes]);
  reactExports.useEffect(() => {
    let isMounted = true;
    Kr.GET(CollectorMasterAPI.fetchUsers()).then((res) => {
      var _a2, _b;
      if (!isMounted) return;
      const data = Array.isArray((_a2 = res == null ? void 0 : res.data) == null ? void 0 : _a2.responseJson) ? res.data.responseJson : Array.isArray((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.data) ? res.data.data : [];
      if (!data.length) {
        setUserOptions([]);
        return;
      }
      setUserOptions(
        data.map((item) => {
          const collector = (item == null ? void 0 : item.collectorMasterDto) || item || {};
          return {
            value: (collector == null ? void 0 : collector.szCollectorCode) || "",
            label: (collector == null ? void 0 : collector.szCollectorName) || "",
            szCollectorCode: (collector == null ? void 0 : collector.szCollectorCode) || "",
            szCollectorName: (collector == null ? void 0 : collector.szCollectorName) || ""
          };
        }).filter((item) => item.value)
      );
    }).catch(() => {
      if (isMounted) {
        setUserOptions([]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  const handleSaveFilter = async () => {
    const trimmedName = String(filterName ?? "").trim();
    if (!trimmedName) return;
    const payload = buildFilterPayload({ filterName: trimmedName, advancedFilters, rules, entityAttributes });
    const sortPayload = buildSortPayload({ sortName: trimmedName, sortRules });
    const viewCode = trimmedName.toUpperCase().trim().replace(/\s+/g, "_");
    const dataBody = {
      listId: "ACLST",
      userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
      moduleName: "COL",
      viewCode: "ACLST_DEF",
      viewName: trimmedName,
      filterJson: (payload == null ? void 0 : payload.filters) || [],
      sortJson: (sortPayload == null ? void 0 : sortPayload.sorts) || [],
      pageNumber: 1,
      pageSize: 100
    };
    try {
      const response = await Kr.POST(ColListingAPI.ListView(screenMenuId), dataBody);
      const newFilter = {
        listViewCode: viewCode,
        viewCode,
        viewName: trimmedName,
        listViewName: trimmedName,
        filterJson: (payload == null ? void 0 : payload.filters) || [],
        sortJson: (sortPayload == null ? void 0 : sortPayload.sorts) || []
      };
      setLocalAddedFilters((prev) => [...prev, newFilter]);
      setSelectedSavedFilterId(viewCode);
      setFilterName("");
      toast.success("Filter saved successfully");
    } catch (error) {
      console.error("Failed to save list view:", error);
      toast.error("Failed to save filter");
    }
  };
  const handleDeleteFilter = async () => {
    var _a2;
    if (!selectedSavedFilterId) return;
    try {
      const selectedFilter = savedFilters.find((f) => getSavedFilterId$1(f) === selectedSavedFilterId);
      if (!selectedFilter) return;
      const dataBody = {
        listId: "ACLST",
        userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
        moduleName: "COL",
        viewCode: selectedSavedFilterId,
        viewName: "",
        filterJson: [],
        sortJson: [],
        pageNumber: 1,
        pageSize: 100
      };
      const response = await Kr.DELETE(ColListingAPI.ListView(screenMenuId), dataBody);
      if (((_a2 = response == null ? void 0 : response.data) == null ? void 0 : _a2.status) === "SUCCESS") {
        onDeleteSavedFilter(selectedSavedFilterId);
        setSelectedSavedFilterId("");
        toast.success("Filter deleted successfully");
      } else {
        toast.error("Failed to delete filter");
      }
    } catch (error) {
      console.error("Failed to delete filter:", error);
      toast.error("Error deleting filter");
    }
  };
  const handleShareFilter = async () => {
    var _a2, _b, _c;
    const selectedFilterId = String(selectedSavedFilterId || "").trim();
    if (!selectedFilterId) {
      toast.error("Please select a saved filter first");
      return;
    }
    const allFilters = [...savedFilters, ...localAddedFilters];
    const selectedFilter = allFilters.find((filter) => getSavedFilterId$1(filter) === selectedFilterId);
    const listViewCode = (selectedFilter == null ? void 0 : selectedFilter.listViewCode) || (selectedFilter == null ? void 0 : selectedFilter.viewCode) || selectedFilterId;
    if (!listViewCode) {
      toast.error("Selected filter is missing listViewCode");
      return;
    }
    const sharedUsers = Array.isArray(selectedUsers) ? selectedUsers.filter(Boolean) : [];
    if (!sharedUsers.length) {
      toast.error("Please select at least one user to share with");
      return;
    }
    try {
      const dataBody = {
        listViewCode,
        sharedToUsers: sharedUsers,
        sharedByUser: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM"
      };
      const response = await Kr.POST(ColListingAPI.shareListView(), dataBody);
      const responseStatus = (_a2 = response == null ? void 0 : response.data) == null ? void 0 : _a2.status;
      const responseMessage = (_b = response == null ? void 0 : response.data) == null ? void 0 : _b.message;
      if (responseStatus === "SUCCESS" || ((_c = response == null ? void 0 : response.data) == null ? void 0 : _c.statusCode) === 200) {
        toast.success(responseMessage || "Filter shared successfully");
      } else if (responseStatus === "PARTIAL_SUCCESS") {
        toast.warning(responseMessage || "View shared with some users, but failed for others");
      } else {
        toast.error(responseMessage || "Failed to share filter");
      }
    } catch (error) {
      console.error("Failed to share filter:", error);
      toast.error("Error sharing filter");
    }
  };
  const operatorOptions = [
    { value: "LIKE", label: "Contains" },
    { value: "is", label: "Is" },
    { value: "is_not", label: "Is Not" },
    { value: "gt", label: "Greater Than" },
    { value: "lt", label: "Less Than" }
  ];
  const sectionTitleStyles = {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "var(--drs-text-tertiary, hsl(215, 25%, 27%))",
    fontFamily: "'Inter', sans-serif"
  };
  const sectionBodyStyles = {
    fontSize: 11,
    color: colors2.text.secondary,
    fontFamily: "'Inter', sans-serif"
  };
  reactExports.useMemo(
    () => (Array.isArray(attributes) ? attributes : []).filter((attr) => String((attr == null ? void 0 : attr.szType) || "").includes("A") && String((attr == null ? void 0 : attr.szAttributeCode) || "").trim()).map((attr) => ({ label: attr.szAttributeDesc || attr.szAttributeCode, value: attr.szAttributeCode })),
    [attributes]
  );
  const sortRuleFieldOptions = reactExports.useMemo(
    () => (Array.isArray(attributes) ? attributes : []).filter((attr) => String((attr == null ? void 0 : attr.szType) || "").includes("S") && String((attr == null ? void 0 : attr.szAttributeCode) || "").trim()).map((attr) => ({ label: attr.szAttributeDesc || attr.szAttributeCode, value: attr.szAttributeCode })),
    [attributes]
  );
  const sortRuleOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" }
  ];
  const userSearchFetcher = reactExports.useCallback(
    async () => ({ data: { responseJson: userOptions } }),
    [userOptions]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      className: "drs-panel-container",
      sx: {
        ...panelThemeVars,
        px: isMobile ? 1.5 : 2,
        py: 2,
        borderBottom: `1px solid var(--drs-border-divider, ${colors2.border})`,
        backgroundColor: "var(--drs-bg-panel, #f8fafc)",
        flexShrink: 0
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
              mb: 2
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { minWidth: 0, flex: 1 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "Advanced Search", translate: false, align: "left", colon: false, sx: sectionTitleStyles }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: "Narrow the account list with portfolio, bucket, amount ranges, and custom rules.",
                    translate: false,
                    align: "left",
                    colon: false,
                    sx: sectionBodyStyles
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Dt,
                  {
                    sx: {
                      p: 0.5,
                      borderRadius: "10px",
                      border: "none",
                      backgroundColor: "transparent",
                      minWidth: 320,
                      maxWidth: 220,
                      flexShrink: 0
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SE,
                        {
                          options: [
                            { label: "Select a saved filter...", value: "" },
                            ...[...savedFilters, ...localAddedFilters].map((filter) => ({
                              label: getSavedFilterName$1(filter),
                              value: getSavedFilterId$1(filter)
                            }))
                          ],
                          value: selectedSavedFilterId,
                          onChange: (event) => {
                            const filterId = event.target.value;
                            setSelectedSavedFilterId(filterId);
                            if (filterId) {
                              const allFilters = [...savedFilters, ...localAddedFilters];
                              const selectedFilter = allFilters.find((f) => getSavedFilterId$1(f) === filterId);
                              if (selectedFilter) {
                                if (typeof onApplySavedFilter === "function") {
                                  onApplySavedFilter(selectedFilter, { runSearch: false });
                                } else {
                                  handleLoadSavedFilter(selectedFilter);
                                }
                              }
                            }
                          },
                          placeholder: "Select a saved filter...",
                          width: "88%"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip$1, { title: "Delete selected filter", arrow: true, placement: "top", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        IconButton,
                        {
                          onClick: handleDeleteFilter,
                          disabled: !selectedSavedFilterId,
                          size: "small",
                          sx: {
                            color: colors2.accent,
                            "&:hover": {
                              backgroundColor: withAlpha(colors2.accent, 0.1)
                            },
                            "&.Mui-disabled": {
                              color: colors2.text.light
                            }
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(FiTrash2, { size: 16 })
                        }
                      ) }) })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: onClose, size: "small", sx: { color: colors2.text.light }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FiX, { size: 16 }) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { borderColor: colors2.border, mb: 2 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(0, 1fr))",
              gap: 1.5,
              "& .MuiInputBase-root": { height: 36, fontSize: 12, borderRadius: "10px" },
              "& .MuiInputLabel-root": { top: -4 }
            },
            children: Object.values(dynamicFilters).map((filter) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 0.5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: filter.desc, translate: false, align: "left", colon: true }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ap,
                {
                  id: filter.code,
                  editable: true,
                  width: "100%",
                  value: (advancedFilters == null ? void 0 : advancedFilters[filter.code]) ?? "",
                  onChange: (event) => onAdvancedFilterChange(filter.code, event.target.value),
                  placeholder: `Enter ${filter.desc}`
                }
              )
            ] }, filter.code))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { borderColor: colors2.border, my: 2 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 1.5,
              width: "100%",
              alignItems: "stretch",
              border: isMobile ? "none" : "1px solid var(--drs-border-divider, #e2e8f0)",
              borderRadius: "12px",
              p: isMobile ? 0 : 1,
              backgroundColor: "transparent"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 1, width: isMobile ? "100%" : "50%", borderRight: isMobile ? "none" : "1px solid var(--drs-border-divider, #e2e8f0)", pr: isMobile ? 0 : 1.5 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1, flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "DEFINE MORE FILTERS", translate: false, align: "left", colon: false, sx: sectionTitleStyles }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Lg,
                    {
                      label: "Add Rule",
                      variant: "outlined",
                      size: "small",
                      inline: true,
                      onClick: onAddRule,
                      startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(FiPlus, { size: 13 }),
                      sx: { textTransform: "none" }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Stack, { spacing: 1, children: rules.map((rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Dt,
                  {
                    sx: {
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "82px minmax(0, 1.05fr) minmax(0, 0.95fr) minmax(0, 1.05fr) 40px",
                      gap: 1,
                      alignItems: "stretch",
                      width: "100%"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SE,
                        {
                          options: [{ label: "AND", value: "AND" }, { label: "OR", value: "OR" }],
                          value: index === 0 ? "AND" : rule.connector,
                          onChange: (event) => onRuleChange(rule.id, "connector", event.target.value),
                          placeholder: "Connector",
                          width: "100%",
                          disabled: index === 0
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SE,
                        {
                          options: [
                            { label: "Select field", value: "" },
                            ...(Array.isArray(attributes) ? attributes : []).filter((attr) => String((attr == null ? void 0 : attr.szType) || "").includes("A") && String((attr == null ? void 0 : attr.szAttributeCode) || "").trim()).map((attr) => ({ label: attr.szAttributeDesc || attr.szAttributeCode, value: attr.szAttributeCode }))
                          ],
                          value: rule.field,
                          onChange: (event) => onRuleChange(rule.id, "field", event.target.value),
                          placeholder: "Field",
                          width: "100%"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SE,
                        {
                          options: operatorOptions.map((option) => ({ label: option.label, value: option.value })),
                          value: rule.operator,
                          onChange: (event) => onRuleChange(rule.id, "operator", event.target.value),
                          placeholder: "Operator",
                          width: "100%"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ap,
                        {
                          editable: true,
                          width: "100%",
                          value: rule.value,
                          onChange: (event) => onRuleChange(rule.id, "value", event.target.value),
                          placeholder: "Value"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        IconButton,
                        {
                          onClick: () => onRemoveRule(rule.id),
                          disabled: rules.length === 1,
                          size: "small",
                          sx: { color: colors2.text.light },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(FiTrash2, { size: 15 })
                        }
                      )
                    ]
                  },
                  rule.id
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 1, width: isMobile ? "100%" : "50%" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1, flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "SORT FILTERS", translate: false, align: "left", colon: false, sx: sectionTitleStyles }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Lg,
                    {
                      label: "Add Sort Rule",
                      variant: "outlined",
                      size: "small",
                      inline: true,
                      onClick: onAddSortRule,
                      startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(FiPlus, { size: 13 }),
                      sx: { textTransform: "none" }
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Stack, { spacing: 1, sx: { width: "100%" }, children: sortRules.map((rule, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Dt,
                  {
                    sx: {
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 36px",
                      gap: 0.5,
                      alignItems: "center",
                      width: "100%"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SE,
                        {
                          options: [{ label: "Select field", value: "" }, ...sortRuleFieldOptions],
                          value: rule.field,
                          onChange: (event) => onSortRuleChange(rule.id, "field", event.target.value),
                          placeholder: "Field",
                          width: "100%"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ButtonGroup, { size: "small", sx: { display: "flex", gap: 0, minWidth: 0 }, children: sortRuleOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Lg,
                        {
                          label: option.label,
                          variant: rule.order === option.value ? "contained" : "outlined",
                          size: "small",
                          inline: true,
                          onClick: () => onSortRuleChange(rule.id, "order", option.value),
                          sx: {
                            textTransform: "none",
                            fontSize: 11,
                            minWidth: 0,
                            flex: 1,
                            borderRadius: option.value === "asc" ? "6px 0 0 6px" : "0 6px 6px 0",
                            backgroundColor: rule.order === option.value ? "var(--drs-accent, #3b82f6)" : "transparent",
                            color: rule.order === option.value ? "white" : "var(--drs-text-primary, #0f172a)",
                            borderColor: "var(--drs-border-default, #e2e8f0)",
                            "&:hover": {
                              backgroundColor: rule.order === option.value ? "var(--drs-accent, #3b82f6)" : "var(--drs-bg-hover, #f1f5f9)"
                            }
                          }
                        },
                        option.value
                      )) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        IconButton,
                        {
                          onClick: () => onRemoveSortRule(rule.id),
                          disabled: sortRules.length === 1,
                          size: "small",
                          sx: { color: colors2.text.light },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(FiTrash2, { size: 14 })
                        }
                      )
                    ]
                  },
                  rule.id
                )) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { borderColor: colors2.border, my: 1 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              p: 1.25,
              borderRadius: "12px",
              width: "100%",
              maxWidth: 650,
              display: "flex",
              flexDirection: "column",
              gap: 0.75
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "Save Filter", translate: false, align: "left", colon: false, sx: sectionTitleStyles }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Dt,
                {
                  sx: {
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 0.75,
                    width: "100%",
                    flexWrap: "wrap"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "flex-start", gap: 3 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "Filter Name", translate: false, align: "left", colon: true }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "flex-start", gap: 1 }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ap,
                          {
                            editable: true,
                            width: "500px",
                            value: filterName,
                            onChange: (event) => setFilterName(event.target.value),
                            placeholder: "Enter Filter Name"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Lg,
                          {
                            label: "Save",
                            variant: "contained",
                            size: "small",
                            inline: true,
                            onClick: handleSaveFilter,
                            disabled: !hasFilterName,
                            startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(SaveIcon, {}),
                            sx: {
                              minWidth: 90,
                              height: 30,
                              flexShrink: 0
                            }
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 0.5, mt: -1 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { display: "flex", alignItems: "center", gap: 0.5, minHeight: 24 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "Share to Users", translate: false, align: "left", colon: true }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 1, width: "100%" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          dc,
                          {
                            searchCode: "USER_SEARCH",
                            customFetchFunction: userSearchFetcher,
                            selectedColumn: "value",
                            selectedValue: selectedUsers,
                            gridDefObj: userSearchGridDef,
                            setSelectedValue: (values) => setSelectedUsers(Array.isArray(values) ? values : values ? [values] : []),
                            gridWidth: 360,
                            gridHeight: 260,
                            searchBoxWidth: "400px",
                            searchBoxHeight: "30px",
                            searchBoxFontSize: 11,
                            placeholder: "Search user",
                            multiSelect: true
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Lg,
                          {
                            label: "Share",
                            variant: "outlined",
                            size: "small",
                            inline: true,
                            onClick: handleShareFilter,
                            disabled: !selectedSavedFilterId || !selectedUsers.length,
                            startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShareOutlinedIcon, { fontSize: "inherit" }),
                            sx: {
                              minWidth: 84,
                              height: 32,
                              flexShrink: 0
                            }
                          }
                        )
                      ] })
                    ] })
                  ] })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { sx: { borderColor: colors2.border, my: 1 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Dt,
          {
            sx: {
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
              gap: 1.25,
              mt: 1,
              marginLeft: "auto"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Lg,
                {
                  label: "Search Accounts",
                  variant: "contained",
                  size: "small",
                  inline: true,
                  onClick: () => onSearch({ sortRules }),
                  disabled: isLoading,
                  startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchIcon, {}),
                  sx: { height: 36, textTransform: "none" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Lg,
                {
                  label: "Clear",
                  variant: "outlined",
                  size: "small",
                  inline: true,
                  onClick: onClear || onReset,
                  startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(BackspaceIcon, {}),
                  sx: { height: 36, textTransform: "none", borderColor: colors2.border }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Lg,
                {
                  label: "Close",
                  variant: "outlined",
                  color: "error",
                  size: "small",
                  inline: true,
                  onClick: onClose,
                  startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, {}),
                  sx: { height: 36, textTransform: "none" }
                }
              )
            ]
          }
        )
      ]
    }
  );
};
const AdvancedSearchPanel$1 = React.memo(AdvancedSearchPanel);
const DISPOSITION_IDS = {
  connected: "connected",
  no_answer: "no_answer",
  busy: "busy",
  switched_off: "switched_off",
  refused: "refused"
};
const AUTO_SUGGESTIONS = {
  [DISPOSITION_IDS.connected]: { nextAction: "oc", daysAhead: 3, resultCode: "CN" },
  [DISPOSITION_IDS.no_answer]: { nextAction: "oc", daysAhead: 1, resultCode: "NA" },
  [DISPOSITION_IDS.busy]: { nextAction: "oc", daysAhead: 0, resultCode: "NC" },
  [DISPOSITION_IDS.switched_off]: { nextAction: "sms", daysAhead: 1, resultCode: "CNT" },
  [DISPOSITION_IDS.refused]: { nextAction: "escalate", daysAhead: 2, resultCode: "RTP" },
  [DISPOSITION_IDS.promise_to_pay]: { nextAction: "oc", daysAhead: 0, resultCode: "PTP" }
};
function addDaysToDate(base, days) {
  return dayjs(base).add(days, "day");
}
function dispositionTonePalette(theme, tone) {
  switch (tone) {
    case "success":
      return theme.palette.success;
    case "warning":
      return theme.palette.warning;
    case "error":
      return theme.palette.error;
    default:
      return theme.palette.primary;
  }
}
function dispositionButtonSx(theme, tone, active) {
  const pal = dispositionTonePalette(theme, tone);
  const main = pal.main;
  const fg = theme.palette.mode === "dark" ? pal.light : pal.dark;
  return {
    textTransform: "none",
    fontSize: 11,
    fontWeight: 500,
    minHeight: 28,
    maxHeight: 28,
    px: 1.25,
    py: 0,
    lineHeight: 1.2,
    borderRadius: 1.5,
    border: `1px solid ${alpha(main, 0.3)}`,
    bgcolor: alpha(main, active ? 0.24 : 0.1),
    color: fg,
    boxShadow: "none",
    "& .MuiButton-startIcon": { mr: 0.5, ml: -0.25 },
    "&:hover": {
      bgcolor: alpha(main, active ? 0.28 : 0.18),
      borderColor: alpha(main, 0.45)
    },
    ...active && {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.35)}`
    }
  };
}
function mapFollowupDropdownOptions(list = [], intl) {
  return (Array.isArray(list) ? list : []).map((item) => {
    if (!item || typeof item !== "object") return null;
    const value = item.szCondition ?? "";
    return value ? {
      value,
      label: item.szi18nDesc ? intl.formatMessage({ id: item.szi18nDesc, defaultMessage: item.szCondition }) : item.szDesc ?? item.szCondition
    } : null;
  }).filter(Boolean);
}
function GroupFollowupForm({
  selectedAccounts = [],
  onSuccess,
  onCancel
}) {
  const theme = useTheme();
  const intl = useIntl();
  const toast = ar();
  const [pickUpRequired, setPickUpRequired] = reactExports.useState(false);
  const [customerOnWatch, setCustomerOnWatch] = reactExports.useState(false);
  const [applyToAll, setApplyToAll] = reactExports.useState(false);
  const [selectedDisposition, setSelectedDisposition] = reactExports.useState("");
  const [actionCode, setActionCode] = reactExports.useState("");
  const [resultCode, setResultCode] = reactExports.useState("");
  const [generatedPromises, setGeneratedPromises] = reactExports.useState([]);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const [followupData, setFollowupData] = reactExports.useState({
    nextAction: "",
    plannedDate: "",
    promiseStartDate: "",
    frequency: "",
    promiseAmount: "",
    numberOfPromises: "",
    delinquencyReason: "",
    bestTimeToCall: ""
  });
  const [partyContactedOptions, setPartyContactedOptions] = reactExports.useState([]);
  const [delinquencyReasonOptions, setDelinquencyReasonOptions] = reactExports.useState([]);
  const [objErrors, setObjErrors] = reactExports.useState({
    action: false,
    result: false,
    delinquencyReason: false,
    promiseStartDate: false,
    frequency: false,
    promiseAmount: false,
    numberOfPromises: false
  });
  const [pickUpData, setPickUpData] = reactExports.useState({
    szVisitFor: "",
    szAddressType: "",
    szContactPerson: "",
    dtVisitDate: "",
    szPhone: "",
    szMobile: "",
    szPickupCollectorGrp: "",
    szPickupCollector: "",
    bdVisitForAmt: "",
    szAddress: ""
  });
  const fetchFollowupDropdowns = reactExports.useCallback(async () => {
    var _a, _b;
    try {
      const response = await Kr.GET(FollowupAPI.Followup(screenMenuId) + `/initializeddropdowns`, {});
      const payload = ((_a = response == null ? void 0 : response.data) == null ? void 0 : _a.responseJson) || ((_b = response == null ? void 0 : response.data) == null ? void 0 : _b.data) || (response == null ? void 0 : response.data) || {};
      setPartyContactedOptions(mapFollowupDropdownOptions(payload.lstPartyContacted, intl));
      setDelinquencyReasonOptions(mapFollowupDropdownOptions(payload.lstDelqReason, intl));
    } catch (error) {
      console.error("Error fetching followup dropdowns:", error);
      toast.error(intl.formatMessage({ id: "error.followup.dropdown.fetch", defaultMessage: "Error fetching dropdown values." }));
    }
  }, [intl, toast]);
  reactExports.useEffect(() => {
    fetchFollowupDropdowns();
  }, [fetchFollowupDropdowns]);
  reactExports.useEffect(() => {
    console.log("GoupFollowupForm ==============================================", screenMenuId);
  }, []);
  reactExports.useEffect(() => {
    if (!selectedDisposition) {
      setActionCode("");
      setResultCode("");
      setFollowupData((prev) => ({ ...prev, nextAction: "", plannedDate: "" }));
      return;
    }
    const sug = AUTO_SUGGESTIONS[selectedDisposition];
    if (!sug) return;
    addDaysToDate(/* @__PURE__ */ new Date(), sug.daysAhead);
    setActionCode(sug.nextAction);
    if (sug.resultCode) {
      setResultCode(sug.resultCode);
      clearFieldError("result");
    }
    setFollowupData((prev) => ({
      ...prev,
      nextAction: sug.nextAction,
      plannedDate: addDaysToDate(/* @__PURE__ */ new Date(), sug.daysAhead)
    }));
  }, [selectedDisposition]);
  const clearFieldError = (field) => setObjErrors((prev) => prev[field] ? { ...prev, [field]: false } : prev);
  const isBlank = (v) => v === null || v === void 0 || v === "" || typeof v === "string" && v.trim() === "";
  const updateField = (field) => (event) => {
    var _a;
    const value = ((_a = event == null ? void 0 : event.target) == null ? void 0 : _a.value) ?? event;
    setFollowupData((prev) => ({ ...prev, [field]: value }));
    if (!isBlank(value)) clearFieldError(field);
  };
  const handleResultSelect = (value, row) => {
    setResultCode(value);
    if (value) clearFieldError("result");
    const rawLimit = row == null ? void 0 : row.iNextActionLimitDays;
    const limit = Number(rawLimit);
    if (rawLimit != null && String(rawLimit).trim() !== "" && Number.isFinite(limit)) {
      setFollowupData((prev) => ({ ...prev, promiseStartDate: addDaysToDate(/* @__PURE__ */ new Date(), limit) }));
      clearFieldError("promiseStartDate");
    } else {
      setFollowupData((prev) => ({ ...prev, promiseStartDate: "" }));
    }
  };
  const isPtpResult = String(resultCode || "").toUpperCase().includes("PTP");
  const buildBulkPayload = () => {
    const today = /* @__PURE__ */ new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const dtResultFallback = `${y}-${m}-${d}`;
    const formattedPromises = generatedPromises.map((p) => {
      var _a;
      return {
        dtPromiseDate: typeof ((_a = p.dtPromiseDate) == null ? void 0 : _a.format) === "function" ? p.dtPromiseDate.format("YYYY-MM-DD") : p.dtPromiseDate,
        bdPromiseAmt: p.bdPromiseAmt
      };
    });
    const accounts = selectedAccounts.map((account) => ({
      custSeqNo: account.CUST_SEQNO ?? account.custSeqNo ?? null,
      acctSeqNo: account.ACNT_SEQNO ?? account.acctSeqNo ?? account.lnAccountSeqNo ?? null,
      caseSeqNo: account.CASE_SEQNO ?? account.caseSeqNo ?? account.lnCaseSeqNo ?? null,
      allocSeqNo: account.ALLOC_SEQNO ?? account.allocSeqNo ?? account.lnAllocSeqNo ?? null,
      partitionCode: account.PARTITION_CODE ?? account.partitionCode ?? account.szPartitionCode ?? "001",
      userCode: account.userCode ?? account.szUserCode ?? "SYSTEM",
      portfolioCode: account.PRTFL ?? account.portfolioCode ?? account.szPortfolioCode ?? ""
    }));
    return {
      accounts,
      // Array of accounts for bulk processing
      followupDto: {
        szActionCode: actionCode,
        dtAction: formatDateTimeForApi(/* @__PURE__ */ new Date()),
        szResultCode: resultCode,
        dtResultCode: dtResultFallback,
        szNextActionCode: followupData.nextAction || actionCode,
        dtNextAction: formatDateTimeForApi(followupData.plannedDate),
        szRemark: followupData.bestTimeToCall || "",
        szPartyContacted: followupData.partyContacted || "G",
        szModeContact: followupData.modeOfContact || "E",
        szPlaceContact: followupData.placeOfContact || "M",
        szPersonContacted: followupData.contactPerson || "A",
        szPartitionCode: "001",
        szLogedInUser: "ADMIN",
        szActivity: "FT2",
        szCollectorGrpCode: "T1",
        bdInstallmentODAmt: null,
        bdPaymentAmt: followupData.paymentAmount ? parseFloat(followupData.paymentAmount) : 2e4,
        szApplytoAllAcc: applyToAll ? "Y" : "N",
        szPickUpReq: pickUpRequired ? "Y" : "N",
        szWatchFlag: customerOnWatch ? "Y" : "N",
        followupVisitRequestDto: pickUpRequired ? {
          szVisitReference: "10182",
          szVisitFor: pickUpData.szVisitFor || "",
          szContactPerson: pickUpData.szContactPerson || "",
          dtVisitDate: formatDateTimeForApi(pickUpData.dtVisitDate),
          bdVisitForAmt: pickUpData.bdVisitForAmt ? parseFloat(pickUpData.bdVisitForAmt) : "",
          szAddressType: pickUpData.szAddressType || "",
          szRemarks: "Pick up Required to collect the Amount",
          szPickupCollectorGrp: pickUpData.szPickupCollectorGrp || "",
          szPickupCollector: pickUpData.szPickupCollector || "",
          szAddress: pickUpData.szAddress || ""
        } : null,
        dtPromiseStartDate: followupData.promiseStartDate ? formatDateTimeForApi(followupData.promiseStartDate) : null,
        bdPromiseAmount: followupData.promiseAmount ? parseFloat(followupData.promiseAmount) : null,
        szPromiseFrequency: followupData.frequency || "",
        noOfPromises: followupData.numberOfPromises ? parseInt(followupData.numberOfPromises) : null,
        lstPromiseDetailsDtos: formattedPromises
      }
    };
  };
  const validateAndSubmit = async () => {
    var _a, _b, _c, _d;
    const nextErrors = {
      result: !resultCode
    };
    if (nextErrors.result) {
      setObjErrors((prev) => ({ ...prev, ...nextErrors }));
      toast.error(intl.formatMessage({
        id: "error.followup.missingFields",
        defaultMessage: "Result are required."
      }));
      return;
    }
    const payload = buildBulkPayload();
    try {
      const response = await Kr.POST(FollowupAPI.Followup(screenMenuId) + `/group-followup`, payload);
      if (response.status === 202 || ((_a = response.data) == null ? void 0 : _a.status) === "Success") {
        toast.success(intl.formatMessage(
          { id: "message.followup.groupSaveSuccess", defaultMessage: "Followup initiated for {count} account(s)." },
          { count: selectedAccounts.length }
        ));
        if (onSuccess) onSuccess(selectedAccounts);
      } else {
        toast.error(((_b = response.data) == null ? void 0 : _b.message) ?? intl.formatMessage({ id: "error.followup.saveFailed" }));
      }
    } catch (err) {
      console.error("Bulk followup error:", err);
      toast.error(((_d = (_c = err == null ? void 0 : err.response) == null ? void 0 : _c.data) == null ? void 0 : _d.message) ?? intl.formatMessage({ id: "error.followup.saveFailed" }));
    }
  };
  const resetForm = () => {
    setPickUpRequired(false);
    setCustomerOnWatch(false);
    setApplyToAll(false);
    setActionCode("");
    setResultCode("");
    setSelectedDisposition("");
    setGeneratedPromises([]);
    setFollowupData({
      nextAction: "",
      plannedDate: "",
      promiseStartDate: "",
      frequency: "",
      promiseAmount: "",
      numberOfPromises: "",
      delinquencyReason: "",
      bestTimeToCall: "",
      partyContacted: ""
    });
    setObjErrors({ action: false, result: false, delinquencyReason: false });
    setPickUpData({
      szVisitFor: "",
      szAddressType: "",
      szContactPerson: "",
      dtVisitDate: "",
      szPhone: "",
      szMobile: "",
      szPickupCollectorGrp: "",
      szPickupCollector: "",
      bdVisitForAmt: "",
      szAddress: ""
    });
  };
  const recordPanelBorder = alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.3 : 0.18);
  const fieldGrid = {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
    gap: 1.5
  };
  const fieldCellSx = { display: "flex", flexDirection: "column", minWidth: 0, width: "100%", gap: 0.5 };
  const dateFieldCellSx = {
    minWidth: 0,
    width: "100%",
    "& .MuiTextField-root": { width: "100% !important" },
    "& .MuiInputBase-root": { fontSize: "0.85rem" },
    "& .MuiInputLabel-root": { fontSize: "0.85rem" },
    "& .MuiSvgIcon-root": { fontSize: "1.1rem" }
  };
  const checkboxCellSx = {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    "& .hcheckbox-wrapper": { width: "auto" },
    "& .hcheckbox-label": { margin: 0, width: "auto" },
    "& .hcheckbox-label.MuiFormControlLabel-root .MuiFormControlLabel-label": {
      marginLeft: "1px !important",
      whiteSpace: "nowrap"
    },
    "& .hcheckbox-input": { paddingRight: "0px" }
  };
  const dispositionButtons = [
    { id: DISPOSITION_IDS.connected, labelId: "label.followup.disposition.connected", Icon: Call, tone: "success" },
    { id: DISPOSITION_IDS.no_answer, labelId: "label.followup.disposition.noAnswer", Icon: PhoneMissed, tone: "warning" },
    { id: DISPOSITION_IDS.busy, labelId: "label.followup.disposition.busy", Icon: PhoneDisabled, tone: "primary" },
    { id: DISPOSITION_IDS.switched_off, labelId: "label.followup.disposition.switchedOff", Icon: Smartphone, tone: "error" },
    { id: DISPOSITION_IDS.refused, labelId: "label.followup.disposition.refused", Icon: Block, tone: "error" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { width: "100%", boxSizing: "border-box", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Dt,
      {
        sx: {
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          px: 1.5,
          py: 0.75,
          mb: 1.5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1.5,
          bgcolor: (t) => t.palette.mode === "dark" ? alpha(t.palette.common.white, 0.04) : alpha(t.palette.grey[500], 0.08),
          width: "100%",
          boxSizing: "border-box"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ps,
            {
              value: intl.formatMessage({ id: "label.followup.quickDispositionTitle", defaultMessage: "Quick Disposition" }),
              colon: false,
              translate: false,
              align: "left",
              component: "div",
              color: theme.palette.primary.main,
              sx: { fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stack, { direction: "row", spacing: 1, sx: { flexWrap: "wrap", rowGap: 1 }, children: dispositionButtons.map(({ id, labelId, Icon, tone }) => {
            const active = selectedDisposition === id;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                disableElevation: true,
                variant: "text",
                onClick: () => setSelectedDisposition(active ? "" : id),
                startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { sx: { fontSize: 12 } }),
                sx: dispositionButtonSx(theme, tone, active),
                children: intl.formatMessage({ id: labelId })
              },
              id
            );
          }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Kg,
      {
        variant: "outlined",
        elevation: 0,
        sx: {
          borderRadius: 1.5,
          overflow: "visible",
          borderColor: recordPanelBorder,
          boxShadow: `inset 0 0 0 1px ${recordPanelBorder}`,
          bgcolor: "background.paper"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", alignItems: "center", gap: 2, px: 3, py: 1.5, borderBottom: "1px solid #7472721a" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(NearMeOutlinedIcon, { sx: { fontSize: 15, color: "primary.main" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ps,
              {
                value: intl.formatMessage({ id: "label.followup.recordTitle", defaultMessage: "Record Follow Up" }),
                colon: false,
                translate: false,
                align: "left",
                component: "div",
                sx: { fontSize: 12, fontWeight: 700, lineHeight: 1.15, color: "var(--drs-text-primary)" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { px: 2, pt: 1.5, pb: 1.5, overflow: "visible", position: "relative" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...fieldGrid, mb: 1.5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({ id: "label.followup.Result", defaultMessage: "Result" }),
                    required: true,
                    colon: false,
                    align: "left",
                    width: "100%"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS(),
                    searchCode: "RECDE",
                    setSelectedValue: handleResultSelect,
                    selectedValue: resultCode,
                    selectedColumn: "szResultCode",
                    gridDefObj: gridResultDefObj,
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: "100%",
                    searchBoxHeight: 30,
                    searchBoxFontSize: 12,
                    error: objErrors.result,
                    placeholder: intl.formatMessage({ id: "label.followup.Result", defaultMessage: "Result" }),
                    popperSx: { zIndex: 1400 },
                    gridContainerSx: { zIndex: 1400 }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({ id: "label.followup.NextAction", defaultMessage: "Next action" }),
                    colon: false,
                    align: "left",
                    width: "100%"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  dc,
                  {
                    apiEndpoint: SEARCH_API_ENDPOINTS.EARLY_COLLECTIONS(),
                    searchCode: "ACDE",
                    setSelectedValue: (value) => {
                      setActionCode(value);
                      setFollowupData((prev) => ({ ...prev, nextAction: value }));
                      if (value) clearFieldError("action");
                    },
                    selectedValue: actionCode,
                    selectedColumn: "SZACTIONCODE",
                    gridDefObj: gridActionDefObj,
                    gridWidth: 350,
                    gridHeight: 300,
                    gridNoOfRowsPerPage: 2,
                    searchBoxWidth: "100%",
                    searchBoxHeight: 30,
                    searchBoxFontSize: 12,
                    placeholder: intl.formatMessage({ id: "label.followup.NextAction", defaultMessage: "Next Action" }),
                    popperSx: { zIndex: 1400 },
                    gridContainerSx: { zIndex: 1400 }
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({ id: "label.followup.PartyContacted", defaultMessage: "Party contacted" }),
                    colon: false,
                    align: "left",
                    width: "100%"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SE,
                  {
                    value: followupData.partyContacted,
                    onChange: updateField("partyContacted"),
                    options: partyContactedOptions,
                    sx: { width: "100%" },
                    width: "100%",
                    placeholder: intl.formatMessage({ id: "label.followup.PartyContacted.placeholder", defaultMessage: "Select party contacted" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...fieldGrid, mb: 1.5 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({ id: "label.followup.PlannedDate", defaultMessage: "Planned date" }),
                    colon: false,
                    align: "left",
                    width: "100%"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: dateFieldCellSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Ug,
                  {
                    value: followupData.plannedDate,
                    onChange: (newVal) => setFollowupData((prev) => ({ ...prev, plannedDate: newVal })),
                    align: lE.DATE,
                    sx: { width: "100%" },
                    width: "100%"
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({ id: "label.followup.ShowLimit" }),
                    colon: false,
                    align: "left",
                    width: "100%"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: dateFieldCellSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Ug,
                  {
                    value: followupData.promiseStartDate,
                    onChange: (newVal) => setFollowupData((prev) => ({ ...prev, promiseStartDate: newVal })),
                    align: lE.DATE,
                    sx: { width: "100%" },
                    width: "100%"
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({ id: "label.followup.DelinquencyReason", defaultMessage: "Delinquency reason" }),
                    colon: false,
                    align: "left",
                    width: "100%"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SE,
                  {
                    value: followupData.delinquencyReason,
                    onChange: updateField("delinquencyReason"),
                    options: delinquencyReasonOptions,
                    sx: { width: "100%" },
                    width: "100%",
                    placeholder: intl.formatMessage({ id: "label.followup.DelinquencyReason.placeholder", defaultMessage: "Select delinquency reason" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...fieldGrid, mb: 1.5, alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { gridColumn: { xs: "1", md: "span 2" }, ...fieldCellSx }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({ id: "label.followup.NotesRemarks", defaultMessage: "Notes / remarks" }),
                    colon: false,
                    align: "left",
                    width: "100%"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  pp,
                  {
                    value: followupData.bestTimeToCall,
                    onChange: updateField("bestTimeToCall"),
                    width: "100%",
                    maxLines: 3,
                    placeholder: intl.formatMessage({
                      id: "label.followup.NotesRemarks"
                    }),
                    translate: false
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...fieldCellSx, justifyContent: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "column", spacing: 1.5, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: checkboxCellSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  cc,
                  {
                    checked: applyToAll,
                    onChange: (e) => setApplyToAll(e.target.checked),
                    align: lE.LEFT,
                    label: "label.followup.ApplyToAll"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: checkboxCellSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  cc,
                  {
                    checked: customerOnWatch,
                    onChange: (e) => setCustomerOnWatch(e.target.checked),
                    align: lE.LEFT,
                    label: intl.formatMessage({ id: "label.followup.CustomerOnWatch" })
                  }
                ) })
              ] }) })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Collapse, { in: isPtpResult, timeout: "auto", unmountOnExit: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { mt: 1, border: "1px solid", borderColor: "divider", borderRadius: 1.5, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: {
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1.1,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: (t) => t.palette.mode === "dark" ? alpha(t.palette.common.white, 0.04) : alpha(t.palette.grey[900], 0.03)
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BoltOutlinedIcon, { sx: { fontSize: 15, color: "primary.main" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ps,
          {
            value: intl.formatMessage({ id: "label.followup.section.promise", defaultMessage: "Promise to Pay (PTP)" }),
            colon: false,
            translate: false,
            align: "left",
            component: "div",
            sx: { fontSize: 12, fontWeight: 700, lineHeight: 1.15, color: "var(--drs-text-primary)" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { px: 2, pt: 1.5, pb: 1.5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 1.5, alignItems: "flex-end", mb: 1.5 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "Start Date", required: true, colon: false, align: "left" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Ug,
              {
                value: followupData.promiseStartDate,
                onChange: (v) => {
                  setFollowupData((p) => ({ ...p, promiseStartDate: v }));
                  if (v) clearFieldError("promiseStartDate");
                },
                error: objErrors.promiseStartDate,
                sx: { width: "100%" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "Frequency", required: true, colon: false, align: "left" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SE,
              {
                value: followupData.frequency,
                onChange: updateField("frequency"),
                error: objErrors.frequency,
                options: [
                  { value: "", label: "Select" },
                  { value: "WEEKLY", label: "Weekly" },
                  { value: "MONTHLY", label: "Monthly" }
                ],
                sx: { width: "100%" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "Amount", required: true, colon: false, align: "left" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ap,
              {
                value: followupData.promiseAmount,
                onChange: updateField("promiseAmount"),
                error: objErrors.promiseAmount,
                placeholder: "Amount"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "No. of Promises", required: true, colon: false, align: "left" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ap,
              {
                value: followupData.numberOfPromises,
                onChange: updateField("numberOfPromises"),
                error: objErrors.numberOfPromises,
                placeholder: "Count"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Lg,
            {
              label: "Generate",
              variant: "contained",
              onClick: () => {
                const start = followupData.promiseStartDate ? dayjs(followupData.promiseStartDate) : null;
                const count = Number(followupData.numberOfPromises || 0);
                const amount = Number(followupData.promiseAmount || 0);
                if (!start || !count || !amount) {
                  toast.error("Please fill all promise fields");
                  return;
                }
                const promises = [];
                let current = start;
                for (let i = 0; i < count; i++) {
                  promises.push({ dtPromiseDate: current, bdPromiseAmt: amount });
                  current = followupData.frequency === "WEEKLY" ? current.add(7, "day") : current.add(1, "month");
                }
                setGeneratedPromises(promises);
              }
            }
          )
        ] }),
        generatedPromises.map((row, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "grid", gridTemplateColumns: "2fr 2fr auto", gap: 1, mb: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Ug,
            {
              value: row.dtPromiseDate,
              sx: { width: "100%" },
              onChange: (val) => {
                const u = [...generatedPromises];
                u[index].dtPromiseDate = val;
                setGeneratedPromises(u);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ap,
            {
              value: row.bdPromiseAmt,
              placeholder: "Amount",
              width: "100%",
              onChange: (e) => {
                const u = [...generatedPromises];
                u[index].bdPromiseAmt = e.target.value;
                setGeneratedPromises(u);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            IconButton,
            {
              size: "small",
              onClick: () => setGeneratedPromises((p) => p.filter((_, i) => i !== index)),
              sx: { color: "error.main", border: "1px solid", borderColor: "error.light", borderRadius: 1, width: 30, height: 30 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteOutlineIcon, { sx: { fontSize: 18 } })
            }
          )
        ] }, index))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { mt: 3, pt: 2, borderTop: "1px solid", borderColor: "divider" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Vg,
      {
        onSave: validateAndSubmit,
        onReset: resetForm,
        onClose: onCancel
      }
    ) })
  ] });
}
const Transition$2 = React.forwardRef((props, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Slide, { direction: "left", ref, ...props });
});
function GroupFollowupPopup({
  open,
  onClose,
  selectedAccounts = [],
  onSuccess,
  gridApiRef
}) {
  const intl = useIntl();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(LE, { disableContentWrapper: true, open, onClose, slots: { transition: Transition$2 }, slotProps: { paper: {
    sx: {
      position: "fixed",
      right: 0,
      top: 0,
      bottom: 0,
      margin: 0,
      borderRadius: 0,
      width: { xs: "100%", sm: 500, md: 600 },
      maxWidth: "90vw",
      height: "100vh",
      maxHeight: "100vh",
      bgcolor: "background.default",
      display: "flex",
      flexDirection: "column"
    }
  } }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Kg,
      {
        sx: {
          borderBottom: "1px solid",
          borderColor: "divider",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "column", spacing: 0.5, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: intl.formatMessage({
              id: "label.followup.bulk.title",
              defaultMessage: "Group Follow Up"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", flexWrap: "wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  label: `${selectedAccounts.length} ${intl.formatMessage({
                    id: "label.followup.bulk.accounts",
                    defaultMessage: "Accounts Selected"
                  })}`,
                  size: "small",
                  color: "primary",
                  sx: { fontWeight: 500 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", color: "text.secondary", children: [
                selectedAccounts.slice(0, 3).map((acc) => acc.ACT_NO ?? acc.ACNT_SEQNO ?? "").filter(Boolean).join(",  "),
                selectedAccounts.length > 3 && ` +${selectedAccounts.length - 3} more`
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: onClose, size: "small", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, {}) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { sx: { p: 0, overflowY: "auto", flex: 1 }, children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      GroupFollowupForm,
      {
        selectedAccounts,
        onSuccess: (processedAccounts) => {
          if (onSuccess) onSuccess(processedAccounts);
          onClose();
        },
        onCancel: onClose,
        gridApiRef
      }
    ) })
  ] });
}
const SUGGESTED_TAGS = [
  "VIP",
  "Dispute",
  "Legal Review",
  "Skip Trace",
  "Hardship",
  "Fraud",
  "Deceased",
  "Bankruptcy",
  "Settlement"
];
function makeRowId(prefix, idx) {
  return `${prefix}-${idx}-${Math.random().toString(36).slice(2, 9)}`;
}
function isSuccessPayload(data) {
  if (!data) return false;
  const s = data.status;
  return s === "Success" || s === 200 || s === "200";
}
function GroupTagForm({
  selectedAccounts = [],
  onSuccess,
  onCancel,
  gridApiRef
}) {
  const theme = useTheme();
  const intl = useIntl();
  const toast = ar();
  const [tagsToApply, setTagsToApply] = reactExports.useState([]);
  const [newTag, setNewTag] = reactExports.useState("");
  const [newRemark, setNewRemark] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
  const usedSuggestions = React.useMemo(() => {
    const taken = new Set(tagsToApply.map((t) => t.szTag.trim().toLowerCase()));
    return SUGGESTED_TAGS.filter((s) => !taken.has(s.toLowerCase()));
  }, [tagsToApply]);
  const addTagToApply = reactExports.useCallback((tagName) => {
    const value = (tagName ?? newTag).trim();
    if (!value) {
      toast.error(
        intl.formatMessage({
          id: "label.tag.tagRequired",
          defaultMessage: "Tag Name is required to add a tag."
        })
      );
      return;
    }
    if (tagsToApply.some((t) => t.szTag.toLowerCase() === value.toLowerCase())) {
      toast.warn(
        intl.formatMessage({
          id: "label.tag.duplicate",
          defaultMessage: "This tag has already been added"
        })
      );
      return;
    }
    setTagsToApply((prev) => [
      ...prev,
      {
        id: makeRowId("new", prev.length),
        szTag: value,
        szRemark: newRemark.trim(),
        szCollectorCode: userCode,
        szMode: "N"
      }
    ]);
    setNewTag("");
    setNewRemark("");
  }, [newTag, newRemark, tagsToApply, toast, intl, userCode]);
  const removeTagFromApply = reactExports.useCallback((id) => {
    setTagsToApply((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const buildBulkPayload = reactExports.useCallback(() => {
    const commonRequestDto = selectedAccounts.map((account) => ({
      custSeqNo: account.CUST_SEQNO ?? account.custSeqNo ?? null,
      acctSeqNo: account.ACNT_SEQNO ?? account.acctSeqNo ?? account.lnAccountSeqNo ?? null,
      caseSeqNo: account.CASE_SEQNO ?? account.caseSeqNo ?? account.lnCaseSeqNo ?? null,
      allocSeqNo: account.ALLOC_SEQNO ?? account.allocSeqNo ?? account.lnAllocSeqNo ?? null,
      partitionCode: account.PARTITION_CODE ?? account.partitionCode ?? account.szPartitionCode ?? "001",
      userCode: account.userCode ?? account.szUserCode ?? "SYSTEM",
      portfolioCode: account.PRTFL ?? account.portfolioCode ?? account.szPortfolioCode ?? ""
    }));
    const lstTagDetails = tagsToApply.map((tag) => ({
      szTag: tag.szTag,
      szRemark: tag.szRemark || "",
      szCollectorCode: userCode,
      szMode: "N"
    }));
    return {
      lstTagDetails,
      commonRequestDto
    };
  }, [selectedAccounts, tagsToApply, userCode]);
  const persistTags = reactExports.useCallback(async () => {
    var _a, _b;
    if (tagsToApply.length === 0) {
      toast.info(
        intl.formatMessage({
          id: "label.tag.noTagsToApply",
          defaultMessage: "No tags to apply. Please add at least one tag."
        })
      );
      return;
    }
    setSaving(true);
    try {
      const payload = buildBulkPayload();
      const response = await Kr.POST(
        TagAccountAPI.submitGroupTagDetails(),
        payload
      );
      const objResData = response == null ? void 0 : response.data;
      if ((objResData == null ? void 0 : objResData.status) === "Failure" && (objResData == null ? void 0 : objResData.message) === "Validation Failed") {
        handleValidationErrors(intl, toast, objResData.responseJson);
        setSaving(false);
        return;
      }
      if (isSuccessPayload(objResData)) {
        toast.success(
          objResData.message || intl.formatMessage(
            {
              id: "message.tags.applySuccess",
              defaultMessage: "{count} tag(s) applied to {accounts} account(s)"
            },
            {
              count: tagsToApply.length,
              accounts: selectedAccounts.length
            }
          )
        );
        const processedAccounts = selectedAccounts.map((acc) => ({
          ...acc,
          tags: [
            ...acc.tags || [],
            ...tagsToApply.map((tag) => ({
              szTag: tag.szTag,
              szRemark: tag.szRemark || "",
              szCollectorCode: userCode,
              dtModifiedOn: (/* @__PURE__ */ new Date()).toISOString()
            }))
          ]
        }));
        if (onSuccess) {
          onSuccess(processedAccounts);
        }
        setTagsToApply([]);
        setNewTag("");
        setNewRemark("");
      } else {
        const errMsg = (objResData == null ? void 0 : objResData.message) || intl.formatMessage({
          id: "error.tags.applyFailed",
          defaultMessage: "Failed to apply tags to selected accounts"
        });
        toast.error(errMsg);
      }
    } catch (error) {
      console.error("Error applying tags:", error);
      toast.error(
        ((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({
          id: "error.tags.applyNetwork",
          defaultMessage: "Error while applying tags."
        })
      );
    } finally {
      setSaving(false);
    }
  }, [selectedAccounts, tagsToApply, buildBulkPayload, toast, intl, onSuccess, userCode]);
  const resetForm = reactExports.useCallback(() => {
    setTagsToApply([]);
    setNewTag("");
    setNewRemark("");
  }, []);
  reactExports.useCallback(() => {
    resetForm();
    if (onCancel) onCancel();
  }, [onCancel, resetForm]);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTagToApply();
    }
  };
  const sectionLabelSx = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    textTransform: "uppercase",
    color: "text.secondary"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        position: "relative"
      },
      children: [
        saving && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
              borderRadius: 1
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, {})
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              px: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 2 },
              pb: 2
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 2, sx: { maxWidth: 1320, mx: "auto", width: "100%" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0.5, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage({
                      id: "label.tag.addNewTag",
                      defaultMessage: "ADD NEW TAG"
                    }),
                    colon: false,
                    translate: false,
                    align: "left",
                    component: "div",
                    color: theme.palette.primary.main,
                    sx: sectionLabelSx
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Dt,
                  {
                    sx: {
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 1,
                      alignItems: { xs: "stretch", sm: "center" }
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { flex: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ap,
                        {
                          value: newTag,
                          onChange: (e) => {
                            setNewTag(e.target.value);
                          },
                          onKeyDown: handleKeyPress,
                          editable: true,
                          width: "100%",
                          placeholder: intl.formatMessage({
                            id: "label.tag.tagPlaceholder",
                            defaultMessage: "Enter tag name"
                          })
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { flex: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        ap,
                        {
                          value: newRemark,
                          onChange: (e) => setNewRemark(e.target.value),
                          onKeyDown: handleKeyPress,
                          editable: true,
                          width: "100%",
                          placeholder: intl.formatMessage({
                            id: "label.tag.remarkPlaceholder",
                            defaultMessage: "Remark (optional)"
                          })
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { flexShrink: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "contained",
                          size: "small",
                          startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, { sx: { fontSize: 12 } }),
                          onClick: () => addTagToApply(),
                          disabled: saving,
                          sx: {
                            height: 40,
                            minWidth: 80,
                            textTransform: "none"
                          },
                          children: intl.formatMessage({
                            id: "button.add",
                            defaultMessage: "Add"
                          })
                        }
                      ) })
                    ]
                  }
                ),
                usedSuggestions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { mt: 1 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Typography,
                    {
                      sx: {
                        fontSize: 10,
                        color: "text.secondary",
                        mb: 0.5
                      },
                      children: intl.formatMessage({
                        id: "label.tag.suggestions",
                        defaultMessage: "Suggestions:"
                      })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Dt,
                    {
                      sx: {
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.75
                      },
                      children: usedSuggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Chip,
                        {
                          size: "small",
                          variant: "outlined",
                          label: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Dt,
                            {
                              component: "span",
                              sx: {
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.25,
                                fontSize: 11
                              },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(AddIcon, { sx: { fontSize: 12 } }),
                                s
                              ]
                            }
                          ),
                          onClick: () => addTagToApply(s),
                          sx: {
                            borderStyle: "dashed",
                            height: 26,
                            cursor: "pointer",
                            "& .MuiChip-label": { px: 1 }
                          }
                        },
                        s
                      ))
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { spacing: 0.5, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ps,
                  {
                    value: intl.formatMessage(
                      {
                        id: "label.tag.tagsToApply",
                        defaultMessage: "TAGS TO APPLY ({count})"
                      },
                      { count: tagsToApply.length }
                    ),
                    colon: false,
                    translate: false,
                    align: "left",
                    component: "div",
                    color: theme.palette.primary.main,
                    sx: sectionLabelSx
                  }
                ),
                tagsToApply.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Kg,
                  {
                    variant: "outlined",
                    sx: {
                      py: 3,
                      px: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      bgcolor: alpha(theme.palette.text.primary, 0.02),
                      borderColor: alpha(theme.palette.text.primary, 0.12),
                      borderStyle: "dashed",
                      borderRadius: 2
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Tag,
                        {
                          sx: {
                            fontSize: 32,
                            color: alpha(theme.palette.text.secondary, 0.2),
                            mb: 1
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { sx: { fontSize: 13, color: "text.secondary" }, children: intl.formatMessage({
                        id: "label.tag.noTagsToApply",
                        defaultMessage: "No tags added yet. Enter a tag name above."
                      }) })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Stack, { spacing: 0.75, children: tagsToApply.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Kg,
                  {
                    variant: "outlined",
                    sx: {
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.06),
                      borderColor: alpha(theme.palette.primary.main, 0.25)
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Chip,
                        {
                          label: t.szTag,
                          size: "small",
                          color: "primary",
                          sx: {
                            "& .MuiChip-label": { fontSize: 11, fontWeight: 600 }
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Typography,
                        {
                          sx: {
                            flex: 1,
                            fontSize: 11,
                            color: "text.secondary",
                            minWidth: 0
                          },
                          noWrap: true,
                          children: t.szRemark || "—"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Typography,
                        {
                          sx: {
                            fontSize: 10,
                            fontFamily: "ui-monospace, monospace",
                            color: "text.secondary",
                            opacity: 0.7,
                            flexShrink: 0,
                            ml: "auto"
                          },
                          children: t.szCollectorCode || userCode
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        IconButton,
                        {
                          size: "small",
                          onClick: () => removeTagFromApply(t.id),
                          disabled: saving,
                          sx: { color: "error.main", opacity: 0.85 },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteOutlineIcon, { sx: { fontSize: 18 } })
                        }
                      )
                    ]
                  },
                  t.id
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Typography,
                {
                  variant: "caption",
                  color: "text.secondary",
                  sx: {
                    mt: 1,
                    p: 1.5,
                    bgcolor: alpha(theme.palette.info.main, 0.04),
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: alpha(theme.palette.info.main, 0.15),
                    fontSize: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16 }, children: "ℹ️" }),
                    intl.formatMessage(
                      {
                        id: "label.tag.bulk.info",
                        defaultMessage: "The tag(s) will be applied to all {count} selected account(s)."
                      },
                      { count: selectedAccounts.length }
                    )
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onSave: persistTags,
            onReset: resetForm,
            onClose: onCancel,
            saveLabel: saving ? intl.formatMessage({
              id: "button.applying",
              defaultMessage: "Applying..."
            }) : intl.formatMessage(
              {
                id: "button.applyTags",
                defaultMessage: "Apply {count} Tag(s)"
              },
              { count: tagsToApply.length }
            ),
            saveDisabled: tagsToApply.length === 0 || saving,
            saveLoading: saving
          }
        )
      ]
    }
  );
}
const Transition$1 = React.forwardRef((props, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Slide, { direction: "left", ref, ...props });
});
function GroupTagPopup({
  open,
  onClose,
  selectedAccounts = [],
  onSuccess,
  gridApiRef
}) {
  const intl = useIntl();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(LE, { disableContentWrapper: true, open, onClose, slots: { transition: Transition$1 }, slotProps: { paper: {
    sx: {
      position: "fixed",
      right: 0,
      top: 0,
      bottom: 0,
      margin: 0,
      borderRadius: 0,
      width: { xs: "100%", sm: 500, md: 600 },
      maxWidth: "90vw",
      height: "100vh",
      maxHeight: "100vh",
      bgcolor: "background.default",
      display: "flex",
      flexDirection: "column"
    }
  } }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Kg,
      {
        sx: {
          borderBottom: "1px solid",
          borderColor: "divider",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "column", spacing: 0.5, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { variant: "h6", sx: { fontWeight: 600 }, children: intl.formatMessage(
              {
                id: "label.tag.bulk.title",
                defaultMessage: "Apply Tags to {count} Accounts"
              },
              { count: selectedAccounts.length }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", flexWrap: "wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  label: `${selectedAccounts.length} ${intl.formatMessage({
                    id: "label.tag.bulk.accounts",
                    defaultMessage: "Accounts Selected"
                  })}`,
                  size: "small",
                  color: "primary",
                  sx: { fontWeight: 500 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", color: "text.secondary", children: [
                selectedAccounts.slice(0, 3).map((acc) => acc.ACT_NO ?? acc.ACNT_SEQNO ?? "").filter(Boolean).join(",  "),
                selectedAccounts.length > 3 && ` +${selectedAccounts.length - 3} more`
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: onClose, size: "small", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, {}) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { sx: { p: 0, overflowY: "auto", flex: 1 }, children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      GroupTagForm,
      {
        selectedAccounts,
        onSuccess: (processedAccounts) => {
          if (onSuccess) onSuccess(processedAccounts);
          onClose();
        },
        onCancel: onClose,
        gridApiRef
      }
    ) })
  ] });
}
const transparentSurface = {
  bgcolor: "transparent",
  background: "transparent",
  backgroundColor: "transparent",
  boxShadow: "none"
};
function getNoteTypeValue(item) {
  if (item == null) return "";
  if (typeof item === "string" || typeof item === "number") return String(item);
  return String(
    item.szCondition || item.code || item.szNoteType || item.szCode || item.value || item.label || ""
  );
}
function getNoteTypeLabel(item, value, intl) {
  var _a;
  if (item && typeof item === "object") {
    const label = item.szi18nDesc || item.szi18nDescription || item.szI18nDesc || item.szI18nDescription || item.szDesc || item.szDescription || item.description || item.label || item.szNoteType || value;
    return ((_a = intl.messages) == null ? void 0 : _a[label]) ? intl.formatMessage({ id: label, defaultMessage: label }) : String(label);
  }
  return value;
}
function mapCustomerNotesTypes(payload, intl) {
  const rows = Array.isArray(payload) ? payload : (payload == null ? void 0 : payload.customerNotesTypes) || (payload == null ? void 0 : payload.customerNotesTypeList) || (payload == null ? void 0 : payload.notesTypes) || (payload == null ? void 0 : payload.data) || (payload == null ? void 0 : payload.rows) || [];
  if (!Array.isArray(rows)) return [];
  return rows.map((item) => {
    const value = getNoteTypeValue(item).trim();
    if (!value) return null;
    return {
      value,
      label: getNoteTypeLabel(item, value, intl)
    };
  }).filter(Boolean);
}
function GroupMemoForm({
  selectedAccounts = [],
  onSuccess,
  onCancel,
  gridApiRef
}) {
  const intl = useIntl();
  const theme = useTheme();
  const toast = ar();
  const { themeVars, surfaces, text, border } = $e();
  const { colors: colors2 } = useColorTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const [accountCustLevel, setAccountCustLevel] = reactExports.useState("A");
  const [interactionType, setInteractionType] = reactExports.useState("");
  const [isSticky, setIsSticky] = reactExports.useState(false);
  const [notes, setNotes] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [interactionOptions, setInteractionOptions] = reactExports.useState([]);
  const userCode = sessionStorage.getItem("SEC_USERNAME") || "SYSTEM";
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const panelThemeVars = reactExports.useCallback(() => {
    if (!isDarkMode) return {};
    return {
      "--drs-bg-panel": mixColors(mixColors("#1f2937", colors2.secondaryDark, 0.52), colors2.primaryDark, 0.3),
      "--drs-bg-input": mixColors(mixColors("#111827", colors2.secondaryDark, 0.3), colors2.primaryDark, 0.18),
      "--drs-border-divider": mixColors("#334155", colors2.primary, 0.28),
      "--drs-control-border": withAlpha(colors2.primaryLight, 0.38),
      "--drs-control-hover-border": colors2.primaryLight,
      "--drs-hover-bg": withAlpha(colors2.primary, 0.18),
      "--drs-button-outline-bg": withAlpha(colors2.primary, 0.12),
      "--drs-button-outline-hover": withAlpha(colors2.primary, 0.2),
      "--drs-button-outline-text": colors2.primaryLight,
      "--drs-text-secondary": mixColors("#cbd5e1", colors2.secondaryLight, 0.42),
      "--drs-text-tertiary": mixColors("#94a3b8", colors2.secondaryLight, 0.35)
    };
  }, [colors2, isDarkMode]);
  React.useEffect(() => {
    let active = true;
    Kr.GET(`${MemosAPI.MemosApi(screenMenuId)}/getCustomerNotesTypes`).then((res) => {
      var _a;
      if (!active) return;
      const payload = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.responseJson) ?? (res == null ? void 0 : res.data);
      setInteractionOptions(mapCustomerNotesTypes(payload, intl));
    }).catch(() => {
      if (active) setInteractionOptions([]);
    });
    return () => {
      active = false;
    };
  }, [intl.locale]);
  const levelOptions = [
    {
      value: "A",
      label: intl.formatMessage({ id: "label.memos.level.account" }),
      Icon: AccountCircleOutlinedIcon
    },
    {
      value: "C",
      label: intl.formatMessage({ id: "label.memos.level.customer" }),
      Icon: GroupsOutlinedIcon
    }
  ];
  const optionsBoxSx = {
    ...themeVars,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    flexWrap: "wrap",
    minHeight: 32,
    px: 0.75,
    border: 1,
    borderColor: border.divider,
    borderRadius: "5px",
    bgcolor: surfaces.input,
    "&:hover": {
      borderColor: border.hover
    }
  };
  const stickyHintSx = {
    display: "flex",
    alignItems: "center",
    gap: 0.4,
    mt: 0.5,
    color: theme.palette.warning.dark,
    ...memosTextSx,
    lineHeight: 1.2,
    "& .MuiSvgIcon-root": {
      fontSize: 13,
      color: theme.palette.warning.main
    }
  };
  const buildBulkPayload = reactExports.useCallback(() => {
    const commonRequestDto = selectedAccounts.map((account) => ({
      custSeqNo: account.CUST_SEQNO ?? account.custSeqNo ?? null,
      acctSeqNo: account.ACNT_SEQNO ?? account.acctSeqNo ?? account.lnAccountSeqNo ?? null,
      caseSeqNo: account.CASE_SEQNO ?? account.caseSeqNo ?? account.lnCaseSeqNo ?? null,
      allocSeqNo: account.ALLOC_SEQNO ?? account.allocSeqNo ?? account.lnAllocSeqNo ?? null,
      partitionCode: account.PARTITION_CODE ?? account.partitionCode ?? account.szPartitionCode ?? "001",
      userCode: account.userCode ?? account.szUserCode ?? "SYSTEM",
      portfolioCode: account.PRTFL ?? account.portfolioCode ?? account.szPortfolioCode ?? ""
    }));
    return {
      commonRequestDto,
      customerNotesDto: {
        szNoteType: interactionType,
        szNotes: notes.trim(),
        szIsStickyNote: isSticky ? "Y" : "N",
        szAccountCustLevel: accountCustLevel,
        szCreatedBy: userCode
      }
    };
  }, [selectedAccounts, interactionType, notes, isSticky, accountCustLevel, userCode]);
  const handleSubmit = reactExports.useCallback(async () => {
    var _a, _b;
    const trimmedNotes = (notes || "").trim();
    const trimmedType = (interactionType || "").trim();
    if (!trimmedType) {
      toast.error(intl.formatMessage({ id: "error.memos.requiredInteraction" }));
      return;
    }
    if (!trimmedNotes) {
      toast.error(intl.formatMessage({ id: "error.memos.requiredNote" }));
      return;
    }
    if (!selectedAccounts || selectedAccounts.length === 0) {
      toast.error(intl.formatMessage({ id: "error.memos.noAccounts" }));
      return;
    }
    setSaving(true);
    try {
      const payload = buildBulkPayload();
      const response = await Kr.POST(
        `${MemosAPI.MemosApi(screenMenuId)}/group-Notes`,
        payload
      );
      const objResData = response == null ? void 0 : response.data;
      const status = (objResData == null ? void 0 : objResData.status) ?? (response == null ? void 0 : response.status);
      const message = (objResData == null ? void 0 : objResData.message) ?? (objResData == null ? void 0 : objResData.responseMessage);
      const isSuccess = status === 200 || status === "200" || String(status).trim().toLowerCase() === "success" || typeof message === "string" && String(message).trim().toLowerCase() === "success";
      if (isSuccess) {
        toast.success(
          objResData.message || intl.formatMessage(
            {
              id: "message.memos.groupSaveSuccess",
              defaultMessage: "Memo added to {count} account(s)"
            },
            { count: selectedAccounts.length }
          )
        );
        const processedAccounts = selectedAccounts.map((acc) => ({
          ...acc,
          memos: [
            ...acc.memos || [],
            {
              szNoteType: trimmedType,
              szNotes: trimmedNotes,
              szIsStickyNote: isSticky ? "Y" : "N",
              szAccountCustLevel: accountCustLevel,
              szCreatedBy: userCode,
              dtCreated: (/* @__PURE__ */ new Date()).toISOString()
            }
          ]
        }));
        if (onSuccess) {
          onSuccess(processedAccounts);
        }
        setNotes("");
        setInteractionType("");
        setIsSticky(false);
        setAccountCustLevel("A");
      } else if (status === "Failure" || message === "Validation Failed") {
        handleValidationErrors(intl, toast, objResData == null ? void 0 : objResData.responseJson);
      } else {
        toast.error(
          (objResData == null ? void 0 : objResData.message) || intl.formatMessage({ id: "error.memos.groupSaveFailed" })
        );
      }
    } catch (error) {
      console.error("Error saving group memo:", error);
      toast.error(
        ((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || intl.formatMessage({ id: "error.saving.groupMemos" })
      );
    } finally {
      setSaving(false);
    }
  }, [
    notes,
    interactionType,
    isSticky,
    accountCustLevel,
    selectedAccounts,
    buildBulkPayload,
    toast,
    intl,
    onSuccess,
    userCode
  ]);
  const resetForm = reactExports.useCallback(() => {
    setAccountCustLevel("A");
    setInteractionType("");
    setIsSticky(false);
    setNotes("");
  }, []);
  reactExports.useCallback(() => {
    resetForm();
    if (onCancel) onCancel();
  }, [onCancel, resetForm]);
  ({
    color: isDarkMode ? colors2.primaryLight : "text.secondary"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Dt,
    {
      sx: {
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        bgcolor: isDarkMode ? colors2.primaryDark : "background.default",
        ...panelThemeVars()
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Dt,
          {
            sx: {
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              px: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 2 },
              pb: 2
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Kg,
              {
                elevation: 0,
                sx: {
                  ...themeVars,
                  borderRadius: "8px",
                  border: 1,
                  borderColor: isDarkMode ? "var(--drs-border-divider, #334155)" : "divider",
                  bgcolor: surfaces.paper,
                  width: "100%",
                  overflow: "hidden"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...transparentSurface, px: 2, py: 2.25, width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Dt,
                  {
                    sx: {
                      ...transparentSurface,
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: 2.25,
                      width: "100%"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Dt,
                        {
                          sx: {
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                            gap: 2,
                            width: "100%"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Dt,
                              {
                                sx: {
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0.5,
                                  minWidth: 0
                                },
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    ps,
                                    {
                                      value: "label.memos.field.level",
                                      translate: true,
                                      colon: false,
                                      align: "left",
                                      required: true,
                                      sx: {
                                        color: isDarkMode ? "var(--drs-text-secondary, #94a3b8)" : void 0
                                      }
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    SE,
                                    {
                                      name: "accountCustLevel",
                                      value: accountCustLevel,
                                      onChange: (e) => setAccountCustLevel(e.target.value),
                                      options: levelOptions,
                                      placeholder: intl.formatMessage({ id: "label.memos.level.placeholder" }),
                                      width: "100%",
                                      StartIcon: AccountCircleOutlinedIcon,
                                      sx: {
                                        "& .MuiInputBase-root": {
                                          backgroundColor: isDarkMode ? "var(--drs-bg-input, #1a1a1a)" : void 0,
                                          color: isDarkMode ? "var(--drs-text-primary, #ffffff)" : void 0
                                        }
                                      }
                                    }
                                  )
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Dt,
                              {
                                sx: {
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0.5,
                                  minWidth: 0
                                },
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    ps,
                                    {
                                      value: "label.Memos.Interaction Type",
                                      translate: true,
                                      colon: false,
                                      align: "left",
                                      required: true,
                                      sx: {
                                        color: isDarkMode ? "var(--drs-text-secondary, #94a3b8)" : void 0
                                      }
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    SE,
                                    {
                                      name: "interactionType",
                                      value: interactionType,
                                      onChange: (e) => setInteractionType(e.target.value),
                                      options: interactionOptions,
                                      placeholder: intl.formatMessage({ id: "label.memos.interaction.placeholder" }),
                                      width: "100%",
                                      sx: {
                                        "& .MuiInputBase-root": {
                                          backgroundColor: isDarkMode ? "var(--drs-bg-input, #1a1a1a)" : void 0,
                                          color: isDarkMode ? "var(--drs-text-primary, #ffffff)" : void 0
                                        }
                                      }
                                    }
                                  )
                                ]
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Dt,
                        {
                          sx: {
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
                            gap: 2,
                            width: "100%"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Dt,
                              {
                                sx: {
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0.5,
                                  minWidth: 0
                                },
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    ps,
                                    {
                                      value: "label.memos.options",
                                      translate: true,
                                      colon: false,
                                      align: "left",
                                      sx: {
                                        color: isDarkMode ? "var(--drs-text-secondary, #94a3b8)" : void 0
                                      }
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: optionsBoxSx, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    cc,
                                    {
                                      id: "memosStickyNote",
                                      label: "label.memos.markStickyNote",
                                      checked: isSticky,
                                      onChange: (e) => setIsSticky(e.target.checked),
                                      Icon: DescriptionOutlinedIcon,
                                      labelGap: "4px"
                                    }
                                  ) }),
                                  isSticky ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { component: "p", sx: { m: 0, ...stickyHintSx }, children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(BoltOutlinedIcon, {}),
                                    intl.formatMessage({ id: "label.memos.stickyPinnedHint" })
                                  ] }) : null
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              Dt,
                              {
                                sx: {
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 0.5,
                                  minWidth: 0
                                },
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    ps,
                                    {
                                      value: "label.Memos.Notes",
                                      translate: true,
                                      colon: false,
                                      align: "left",
                                      required: true,
                                      sx: {
                                        color: isDarkMode ? "var(--drs-text-secondary, #94a3b8)" : void 0
                                      }
                                    }
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    pp,
                                    {
                                      value: notes,
                                      onChange: (e) => setNotes(e.target.value),
                                      placeholder: isSticky ? intl.formatMessage({ id: "label.memos.notes.placeholder.sticky" }) : intl.formatMessage({ id: "label.memos.notes.placeholder" }),
                                      width: "100%",
                                      maxLines: 4,
                                      sx: {
                                        "& .MuiInputBase-root": {
                                          backgroundColor: isDarkMode ? "var(--drs-bg-input, #1a1a1a)" : void 0,
                                          color: isDarkMode ? "var(--drs-text-primary, #ffffff)" : void 0
                                        },
                                        "& .MuiInputBase-input": {
                                          color: isDarkMode ? "var(--drs-text-primary, #ffffff)" : void 0
                                        }
                                      }
                                    }
                                  )
                                ]
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { ...transparentSurface, width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Typography,
                        {
                          variant: "caption",
                          color: "text.secondary",
                          sx: {
                            p: 1.5,
                            bgcolor: isDarkMode ? alpha(colors2.primary, 0.08) : alpha(theme.palette.info.main, 0.04),
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: isDarkMode ? alpha(colors2.primaryLight, 0.15) : alpha(theme.palette.info.main, 0.15),
                            fontSize: 12,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            width: "100%",
                            color: isDarkMode ? "var(--drs-text-secondary, #94a3b8)" : "text.secondary"
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 16 }, children: "ℹ️" }),
                            intl.formatMessage(
                              {
                                id: "label.memo.bulk.info",
                                defaultMessage: "The memo will be added to all {count} selected account(s)."
                              },
                              { count: selectedAccounts.length }
                            )
                          ]
                        }
                      ) })
                    ]
                  }
                ) })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Vg,
          {
            onSave: handleSubmit,
            onReset: resetForm,
            onClose: onCancel,
            saveLabel: saving ? intl.formatMessage({
              id: "button.saving",
              defaultMessage: "Saving..."
            }) : intl.formatMessage(
              {
                id: "button.addMemo",
                defaultMessage: "Add Memo"
              }
            ),
            saveDisabled: saving || !notes.trim() || !interactionType,
            saveLoading: saving
          }
        )
      ]
    }
  );
}
const Transition = React.forwardRef((props, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Slide, { direction: "left", ref, ...props });
});
function GroupMemoPopup({
  open,
  onClose,
  selectedAccounts = [],
  onSuccess,
  gridApiRef
}) {
  const intl = useIntl();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(LE, { disableContentWrapper: true, open, onClose, slots: { transition: Transition }, slotProps: { paper: {
    sx: {
      position: "fixed",
      right: 0,
      top: 0,
      bottom: 0,
      margin: 0,
      borderRadius: 0,
      width: { xs: "100%", sm: 500, md: 600 },
      maxWidth: "90vw",
      height: "100vh",
      maxHeight: "100vh",
      bgcolor: "background.default",
      display: "flex",
      flexDirection: "column"
    }
  } }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Kg,
      {
        sx: {
          borderBottom: "1px solid",
          borderColor: "divider",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "column", spacing: 0.5, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "h6", sx: { fontWeight: 600 }, children: intl.formatMessage({
              id: "label.memo.bulk.title",
              defaultMessage: "Group Memo"
            }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", flexWrap: "wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Chip,
                {
                  label: `${selectedAccounts.length} ${intl.formatMessage({
                    id: "label.memo.bulk.accounts",
                    defaultMessage: "Accounts Selected"
                  })}`,
                  size: "small",
                  color: "primary",
                  sx: { fontWeight: 500 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Typography, { variant: "caption", color: "text.secondary", children: [
                selectedAccounts.slice(0, 3).map((acc) => acc.ACT_NO ?? acc.ACNT_SEQNO ?? "").filter(Boolean).join(",  "),
                selectedAccounts.length > 3 && ` +${selectedAccounts.length - 3} more`
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: onClose, size: "small", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CloseIcon, {}) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Kg, { sx: { p: 0, overflowY: "auto", flex: 1 }, children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
      GroupMemoForm,
      {
        selectedAccounts,
        onSuccess: (processedAccounts) => {
          if (onSuccess) onSuccess(processedAccounts);
          onClose();
        },
        onCancel: onClose,
        gridApiRef
      }
    ) })
  ] });
}
const listGridOuterStyle = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  maxWidth: "100%"
};
const ACCOUNTLIST_BACKEND_PAGE_SIZE = 100;
const getSavedFilterId = (filter) => (filter == null ? void 0 : filter.listViewCode) || (filter == null ? void 0 : filter.viewCode) || (filter == null ? void 0 : filter.listViewName) || (filter == null ? void 0 : filter.viewName) || "";
const getSavedFilterName = (filter) => (filter == null ? void 0 : filter.listViewName) || (filter == null ? void 0 : filter.viewName) || getSavedFilterId(filter);
function extractPlainRowData(row) {
  if (!row || typeof row !== "object") return {};
  const source = (row == null ? void 0 : row.data) ?? row;
  return Object.fromEntries(
    Object.entries(source).filter(([key, val]) => {
      if (key.startsWith("__")) return false;
      if (key === "__rowNode") return false;
      const t = typeof val;
      return t === "string" || t === "number" || t === "boolean" || val === null || val === void 0;
    })
  );
}
const ICON_CONFIG = (colors2) => ({
  ESCLYN: {
    header: { icon: FiAlertCircle, color: colors2.accent, tooltip: "Escalation Status" },
    cell: {
      Y: { icon: FiAlertCircle, color: colors2.accent, tooltip: "Escalated", animation: "pulse" },
      default: { icon: FiAlertCircle, color: colors2.text.light, tooltip: "Not Escalated", animation: "none" }
    }
  },
  AUTHYN: {
    header: { icon: FiShield, color: colors2.primary, tooltip: "Authorization Status" },
    cell: {
      Y: { icon: FiCheckCircle, color: colors2.secondary, tooltip: "Authorized", animation: "bounce" },
      N: { icon: FiAlertCircle, color: colors2.accent, tooltip: "Not Authorized", animation: "none" },
      default: { icon: FiShield, color: colors2.text.light, tooltip: "Unknown", animation: "none" }
    }
  },
  RESOL_TYP: {
    header: { icon: FiTrendingUp, color: colors2.secondary, tooltip: "Resolution Type" },
    cell: {
      S: { icon: FiStar, color: colors2.primary, tooltip: "Stabilized", animation: "spin" },
      N: { icon: FiCheckCircle, color: colors2.secondary, tooltip: "Normalized", animation: "bounce" },
      F: { icon: FiLink, color: colors2.accentLight, tooltip: "Follow-up", animation: "pulse" },
      B: { icon: FiAnchor, color: colors2.accent, tooltip: "Broken", animation: "shake" },
      default: { icon: FiTrendingUp, color: colors2.text.light, tooltip: "Unknown", animation: "none" }
    }
  }
});
const ICON_COLUMN_CODES = ["ESCLYN", "AUTHYN", "RESOL_TYP"];
const DELIGHT_ACTION_COLORS = {
  light: {
    call: "hsl(142, 71%, 45%)",
    /* --success */
    sms: "hsl(221, 83%, 53%)",
    /* --primary */
    followUp: "hsl(38, 92%, 50%)",
    /* --warning */
    view: "hsl(220, 20%, 10%)",
    /* --foreground */
    hoverBg: "hsl(221, 83%, 96%)"
    /* --accent */
  },
  dark: {
    call: "hsl(142, 71%, 50%)",
    sms: "hsl(221, 83%, 70%)",
    followUp: "hsl(38, 92%, 55%)",
    view: "hsl(210, 20%, 92%)",
    hoverBg: "hsl(221, 50%, 15%)"
    /* --accent dark */
  }
};
const STATUS_COLUMN_CODES = ["AUTHYN", "ESCLYN", "RESOL_TYP"];
const getRowValue = (row, keys = []) => {
  const match = keys.find((key) => (row == null ? void 0 : row[key]) !== void 0 && (row == null ? void 0 : row[key]) !== null && (row == null ? void 0 : row[key]) !== "");
  return match ? row[match] : "";
};
const findAttribute = (attributes, matcher) => attributes.find((attr) => matcher(attr == null ? void 0 : attr.szAttributeCode, attr == null ? void 0 : attr.szAttributeDesc));
const isAccountNoField = (code = "", desc = "") => code === "ACT_NO" || /account\s*no/i.test(desc);
const isCustomerNoField = (code = "", desc = "") => code === "CUST_NO" || /customer\s*no/i.test(desc);
const isNameField = (code = "", desc = "") => /name/i.test(desc) || ["CUST_NM", "NAME", "CUSTOMER_NAME"].includes(code);
const isPortfolioField = (code = "", desc = "") => code === "PRTFL" || /portfolio/i.test(desc);
const isBucketField = (code = "", desc = "") => code === "BKT" || /bucket/i.test(desc);
const isOsAmountField = (code = "", desc = "") => code === "OS_AMT" || /\bos amount\b|outstanding/i.test(desc);
const isOdAmountField = (code = "", desc = "") => ["OD_AMT", "OVD_AMT"].includes(code) || /overdue amount|\bod amount\b/i.test(desc);
const StatusCell = ({ row, iconConfig }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, width: "100%" }, children: STATUS_COLUMN_CODES.map((code) => {
  var _a;
  const config = (_a = iconConfig == null ? void 0 : iconConfig[code]) == null ? void 0 : _a.cell;
  const iconCfg = (config == null ? void 0 : config[row == null ? void 0 : row[code]]) || (config == null ? void 0 : config.default);
  const Icon = iconCfg == null ? void 0 : iconCfg.icon;
  if (!Icon) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip$1, { title: iconCfg.tooltip, arrow: true, placement: "top", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { component: "span", sx: { display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 15, color: iconCfg.color }) }) }, code);
}) });
const NameCell = ({ value, row }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { display: "flex", alignItems: "center", gap: 1.1, minWidth: 0, width: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ps,
    {
      value: value || "--",
      translate: false,
      align: "left",
      colon: false,
      sx: {
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
        fontWeight: 500,
        color: "var(--drs-text-primary, hsl(220, 20%, 10%))",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }
  ) });
};
const AccountListActionsCell = ({ params, intl, onView, onFollowUp, onCall, onSms, isDark }) => {
  const row = params == null ? void 0 : params.data;
  if (!row) return null;
  const pal = isDark ? DELIGHT_ACTION_COLORS.dark : DELIGHT_ACTION_COLORS.light;
  const actionBtn = (Icon, titleId, defaultTitle, onClick, iconColor) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip$1, { title: intl.formatMessage({ id: titleId, defaultMessage: defaultTitle }), arrow: true, placement: "top", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    IconButton,
    {
      size: "small",
      onClick: (e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      },
      sx: {
        p: 0.35,
        color: iconColor,
        "&:hover": {
          color: iconColor,
          bgcolor: pal.hoverBg
        }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14 })
    }
  ) }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Box,
    {
      className: "drs-actions-cell",
      sx: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%"
      },
      onClick: (e) => e.stopPropagation(),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Box,
        {
          className: "drs-actions-inner",
          sx: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.125
          },
          children: [
            actionBtn(FiPhone, "label.listview.action.call", "Call", onCall, pal.call),
            actionBtn(FiMessageSquare, "label.listview.action.sms", "SMS", onSms, pal.sms),
            actionBtn(FiFileText, "label.listview.action.followUp", "Follow Up", onFollowUp, pal.followUp),
            actionBtn(FiEye, "label.listview.action.view", "View", onView, pal.view)
          ]
        }
      )
    }
  );
};
const BULK_ACTIONS = [
  { key: "tag", label: "Tag", icon: FiTag, path: "/homelayout/tagAccount" },
  { key: "allocate", label: "Allocate", icon: FiUsers, path: "/homelayout/reallocateCase" },
  { key: "strategy", label: "Strategy", icon: FiRefreshCw, path: "/homelayout/stampStrategies" },
  { key: "followup", label: "Follow Up", icon: FiFileText, path: "/homelayout/followup/followup" },
  { key: "memo", label: "Memo", icon: FiMessageSquare, path: "/homelayout/memos" }
];
const TRANSLATION_KEYS = {
  "Account No": "label.listview.accountNo",
  "Customer No": "label.listview.customerNo",
  "Name": "label.listview.name",
  "Portfolio": "label.listview.portfolio",
  "Bucket": "label.listview.bucket",
  "OS Amount": "label.listview.osAmount",
  "Overdue Amount": "label.listview.overdueAmount",
  "Collector Code": "label.listview.collectorCode",
  "Action Code": "label.listview.actionCode",
  "ESCLYN": "label.listview.esc",
  "AUTHYN": "label.listview.auth",
  "RESOL_TYP": "label.listview.res",
  "Accounts List": "label.accounts.list",
  Actions: "label.listview.actions"
};
const DEFAULT_ADVANCED_FILTERS = {};
const buildAdvancedFiltersState = (entityAttributes = []) => {
  const quickFilterAttributes = (Array.isArray(entityAttributes) ? entityAttributes : []).filter(
    (attr) => String((attr == null ? void 0 : attr.szType) || "").includes("Q") && String((attr == null ? void 0 : attr.szAttributeCode) || "").trim()
  );
  return quickFilterAttributes.reduce((acc, attr) => {
    acc[String(attr.szAttributeCode).trim()] = "";
    return acc;
  }, {});
};
const DEFAULT_ADVANCED_RULE = {
  id: "1",
  connector: "AND",
  field: "",
  operator: "=",
  value: ""
};
const normalizeValue = (value) => String(value ?? "").trim().toLowerCase();
const parseNumericValue = (value) => {
  if (value === null || value === void 0 || value === "") return null;
  const normalized = String(value).replace(/,/g, "").trim();
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? null : parsed;
};
const mergeSavedViews = (savedViews = []) => {
  const merged = /* @__PURE__ */ new Map();
  (Array.isArray(savedViews) ? savedViews : []).forEach((item) => {
    const id = (item == null ? void 0 : item.listViewCode) || (item == null ? void 0 : item.viewCode) || (item == null ? void 0 : item.listViewName) || (item == null ? void 0 : item.viewName) || "";
    if (!id) return;
    const existing = merged.get(id) || {
      ...item,
      listViewCode: (item == null ? void 0 : item.listViewCode) || (item == null ? void 0 : item.viewCode) || id,
      viewCode: (item == null ? void 0 : item.viewCode) || (item == null ? void 0 : item.listViewCode) || id,
      listViewName: (item == null ? void 0 : item.listViewName) || (item == null ? void 0 : item.viewName) || id,
      viewName: (item == null ? void 0 : item.viewName) || (item == null ? void 0 : item.listViewName) || id
    };
    existing.filterJson = existing.filterJson || item.filterJson || null;
    existing.sortJson = existing.sortJson || item.sortJson || null;
    merged.set(id, existing);
  });
  return Array.from(merged.values());
};
const getAdvancedFilterCount = (filters, rules) => {
  const filledBaseFilters = Object.values(filters).filter((value) => String(value ?? "").trim() !== "").length;
  const filledRules = rules.filter((rule) => rule.field && String(rule.value ?? "").trim() !== "").length;
  return filledBaseFilters + filledRules;
};
const normalizeAttributeKey = (value = "") => String(value ?? "").trim().toLowerCase();
const resolveAttributeCode = (entityAttributes = [], key) => {
  const normalizedKey = normalizeAttributeKey(key);
  const match = (Array.isArray(entityAttributes) ? entityAttributes : []).find((attr) => {
    return normalizeAttributeKey(attr == null ? void 0 : attr.szAttributeCode) === normalizedKey || normalizeAttributeKey(attr == null ? void 0 : attr.szAttributeDesc) === normalizedKey;
  });
  return (match == null ? void 0 : match.szAttributeCode) || String(key ?? "").toUpperCase();
};
const normalizeSavedFilterOperator = (operator) => {
  const normalized = String(operator ?? "").trim().toUpperCase();
  switch (normalized) {
    case "=":
    case "EQUALS":
      return "is";
    case "!=":
    case "NOT_EQUALS":
      return "is_not";
    case ">":
    case "GREATER_THAN":
      return "gt";
    case "<":
    case "LESS_THAN":
      return "lt";
    case "CONTAINS":
    case "LIKE":
      return "LIKE";
    default:
      return normalized || "LIKE";
  }
};
const parseSavedFilterCriteria = (filterData, entityAttributes = []) => {
  if (!filterData) return null;
  const parseJsonValue = (value) => {
    if (typeof value !== "string") return value;
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  };
  let filters = parseJsonValue(filterData.filterJson);
  const filterArray = (filters == null ? void 0 : filters.filterJson) || filters;
  if (!Array.isArray(filterArray)) return null;
  const nextFilters = buildAdvancedFiltersState(entityAttributes);
  const nextRules = [];
  filterArray.forEach((filter, index) => {
    const { key, opt, value } = filter || {};
    if (!key || value === void 0) return;
    const resolvedKey = resolveAttributeCode(entityAttributes, key);
    const normalizedOpt = String(opt ?? "").trim().toUpperCase();
    const isNormalFilterOperator = ["=", "EQUALS"].includes(normalizedOpt);
    if (isNormalFilterOperator) {
      nextFilters[resolvedKey] = value;
      return;
    }
    nextRules.push({
      id: `${Date.now()}-${index}`,
      connector: "AND",
      field: String(resolvedKey).toUpperCase(),
      operator: normalizeSavedFilterOperator(opt),
      value
    });
  });
  const rawSortJson = parseJsonValue(filterData == null ? void 0 : filterData.sortJson);
  const savedSortRules = Array.isArray(rawSortJson) ? rawSortJson.map((rule) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    field: String((rule == null ? void 0 : rule.key) ?? "").trim().toUpperCase(),
    order: String((rule == null ? void 0 : rule.order) ?? "asc").trim().toLowerCase() || "asc"
  })).filter((rule) => rule.field) : Array.isArray(rawSortJson == null ? void 0 : rawSortJson.sortJson) ? rawSortJson.sortJson.map((rule) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    field: String((rule == null ? void 0 : rule.key) ?? "").trim().toUpperCase(),
    order: String((rule == null ? void 0 : rule.order) ?? "asc").trim().toLowerCase() || "asc"
  })).filter((rule) => rule.field) : [];
  return {
    advancedFilters: nextFilters,
    advancedRules: nextRules.length ? nextRules : [DEFAULT_ADVANCED_RULE],
    sortRules: savedSortRules.length ? savedSortRules : [{ id: "1", field: "", order: "asc" }]
  };
};
const AccountList = ({ language }) => {
  var _a;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const toast = ar();
  const [columnDefs, setColumnDefs] = reactExports.useState([]);
  const [allRows, setAllRows] = reactExports.useState([]);
  const [filteredRows, setFilteredRows] = reactExports.useState([]);
  const [isSearchApplied, setIsSearchApplied] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [searchField, setSearchField] = reactExports.useState("account_no");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = reactExports.useState(false);
  const [isAdvancedSortOpen, setIsAdvancedSortOpen] = reactExports.useState(false);
  const [advancedFilters, setAdvancedFilters] = reactExports.useState(DEFAULT_ADVANCED_FILTERS);
  const [advancedRules, setAdvancedRules] = reactExports.useState([DEFAULT_ADVANCED_RULE]);
  const [advancedSortRules, setAdvancedSortRules] = reactExports.useState([{ id: "1", field: "", order: "asc" }]);
  const [sortRules, setSortRules] = reactExports.useState([{ id: "1", field: "", order: "asc" }]);
  const [savedSorts, setSavedSorts] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [totalRecords, setTotalRecords] = reactExports.useState(0);
  const [pageSize, setPageSize] = reactExports.useState(15);
  const [gridCacheBlockSize, setGridCacheBlockSize] = reactExports.useState(ACCOUNTLIST_BACKEND_PAGE_SIZE);
  const [bulkSelectedRows, setBulkSelectedRows] = reactExports.useState([]);
  const [dashboardOpen, setDashboardOpen] = reactExports.useState(false);
  const location = useLocation();
  const screenMenuId = (_a = location.state) == null ? void 0 : _a.menuId;
  const [groupPopupState, setGroupPopupState] = reactExports.useState({
    open: false,
    type: null,
    // 'followup', 'tag', 'memo'
    selectedAccounts: []
  });
  const [savedFilters, setSavedFilters] = reactExports.useState([]);
  const [selectedSavedFilterId, setSelectedSavedFilterId] = reactExports.useState("");
  const [attributes, setAttributes] = reactExports.useState([]);
  const [entityAttributes, setEntityAttributes] = reactExports.useState([]);
  const gridApiRef = reactExports.useRef(null);
  const allRowsRef = reactExports.useRef([]);
  const totalRecordsRef = reactExports.useRef(0);
  const isSearchAppliedRef = reactExports.useRef(false);
  const intl = useIntl();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    var _a2;
    if ((_a2 = location.state) == null ? void 0 : _a2.openCollectorDashboard) {
      setDashboardOpen(true);
      navigate("/homelayout/listView", { replace: true, state: {} });
    }
  }, [location.state, navigate]);
  const { colors: colors2 } = useColorTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const panelThemeVars = reactExports.useMemo(() => {
    if (!isDarkMode) return {};
    return {
      "--drs-bg-panel": mixColors(mixColors("#1f2937", colors2.secondaryDark, 0.52), colors2.primaryDark, 0.3),
      "--drs-bg-input": mixColors(mixColors("#111827", colors2.secondaryDark, 0.3), colors2.primaryDark, 0.18),
      "--drs-border-divider": mixColors("#334155", colors2.primary, 0.28),
      "--drs-control-border": withAlpha(colors2.primaryLight, 0.38),
      "--drs-control-hover-border": colors2.primaryLight,
      "--drs-hover-bg": withAlpha(colors2.primary, 0.18),
      "--drs-button-outline-bg": withAlpha(colors2.primary, 0.12),
      "--drs-button-outline-hover": withAlpha(colors2.primary, 0.2),
      "--drs-button-outline-text": colors2.primaryLight,
      "--drs-text-secondary": mixColors("#cbd5e1", colors2.secondaryLight, 0.42),
      "--drs-text-tertiary": mixColors("#94a3b8", colors2.secondaryLight, 0.35)
    };
  }, [colors2, isDarkMode]);
  reactExports.useEffect(() => {
    console.log("AccountList State:", {
      columnDefsLength: columnDefs.length,
      allRowsLength: allRows.length,
      filteredRowsLength: filteredRows.length,
      searchTerm,
      isLoading,
      error
    });
  }, [columnDefs, allRows, filteredRows, searchTerm, isLoading, error]);
  const getAlignmentForColumn = reactExports.useCallback((code, desc) => {
    const fieldName = (desc || code || "").toLowerCase().trim();
    if (/(amount|balance|amt|price|value)\b/i.test(fieldName)) return "right";
    if (/(bucket|status|escalation|authorization|resolution|state)\b/i.test(fieldName)) return "center";
    return "left";
  }, []);
  const fieldMap = reactExports.useMemo(
    () => ({
      account_no: ["ACT_NO"],
      customer_no: ["CUST_NO"],
      name: ["NAME", "CUST_NM", "CUSTOMER_NAME"],
      portfolio: ["PRTFL"],
      bucket: ["BKT"],
      od_amount: ["OD_AMT", "OVD_AMT"],
      os_amount: ["OS_AMT"],
      auth: ["AUTHYN"],
      escalation: ["ESCLYN"],
      resolution: ["RESOL_TYP"]
    }),
    []
  );
  const getValueFormatterForColumn = reactExports.useCallback((code, desc) => {
    const fieldName = (desc || code || "").toLowerCase().trim();
    if (ICON_COLUMN_CODES.includes(code)) return void 0;
    if (/amount|balance|amt|price|value/i.test(fieldName)) {
      return (params) => params.value != null ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
      }).format(params.value).replace("₹", "₹ ") : "";
    }
    return void 0;
  }, []);
  const prepareAccountContext = reactExports.useCallback((row) => {
    if (!row) return;
    dispatch(setSelectedRow(row));
    dispatch(fetchHeaderData(row));
  }, [dispatch]);
  const handleViewAccount = reactExports.useCallback((row) => {
    prepareAccountContext(row);
    const storedFunIdItems = localStorage.getItem("SEC_MENUS_FUNID_ITEMS");
    const requestPayload = {
      ...row,
      CLIENT_NAME: "EARLY-COLLECTIONS",
      SEC_MENUS_FUNID_ITEMS: storedFunIdItems ? JSON.parse(storedFunIdItems) : []
    };
    Kr.POST(FunctionFrameworkAPI.createAccountContext(), requestPayload).then((res) => {
      var _a2;
      if (((_a2 = res.data) == null ? void 0 : _a2.status) === "SUCCESS") {
        sessionStorage.setItem("SEC_ACTIVE_MENU_ID", "ECF-overview");
        navigate("/homelayout/OverView", {
          state: {
            menuId: "ECF-overview",
            parentIds: ["EC-ListView", "ECF-Financials"]
          }
        });
      } else {
        console.error("Menu function response error", res);
      }
    }).catch((err) => {
      console.error("Menu function error", err);
    });
  }, [navigate, prepareAccountContext]);
  const handleFollowUp = reactExports.useCallback((row) => {
    prepareAccountContext(row);
    navigate("/homelayout/followup/followup", {
      state: { selectedAccounts: [row], fromList: true }
    });
  }, [navigate, prepareAccountContext]);
  reactExports.useCallback((row) => {
    prepareAccountContext(row);
    navigate("/homelayout/tagAccount", {
      state: { selectedAccounts: [row] }
    });
  }, [navigate, prepareAccountContext]);
  reactExports.useCallback((row) => {
    prepareAccountContext(row);
    navigate("/homelayout/memos", {
      state: { selectedAccounts: [row] }
    });
  }, [navigate, prepareAccountContext]);
  const handleCall = reactExports.useCallback((row) => {
    prepareAccountContext(row);
    navigate("/homelayout/call");
  }, [navigate, prepareAccountContext]);
  const handleSms = reactExports.useCallback((row) => {
    prepareAccountContext(row);
    navigate("/homelayout/sms");
  }, [navigate, prepareAccountContext]);
  const handleAccountClick = reactExports.useCallback((params) => {
    handleViewAccount(params == null ? void 0 : params.data);
  }, [handleViewAccount]);
  const evaluateRule = reactExports.useCallback((row, rule) => {
    if (!rule.field || !String(rule.value ?? "").trim()) return true;
    const candidateKeys = fieldMap[rule.field.toLowerCase()] || [rule.field];
    const rawValue = getRowValue(row, candidateKeys);
    const actual = normalizeValue(rawValue);
    const expected = normalizeValue(rule.value);
    if (rule.operator === "gt" || rule.operator === "lt") {
      const actualNumber = parseNumericValue(rawValue);
      const expectedNumber = parseNumericValue(rule.value);
      if (actualNumber === null || expectedNumber === null) return false;
      return rule.operator === "gt" ? actualNumber > expectedNumber : actualNumber < expectedNumber;
    }
    if (rule.operator === "is") return actual === expected;
    if (rule.operator === "is_not") return actual !== expected;
    return actual.includes(expected);
  }, [fieldMap]);
  reactExports.useCallback((data, searchValue, selectedField, filters, rules) => {
    const trimmedSearch = searchValue.trim();
    const hasSearch = Boolean(trimmedSearch);
    return data.filter((row) => {
      const matchesSearch = !hasSearch || (() => {
        const lowercasedSearch = trimmedSearch.toLowerCase();
        if (selectedField === "all") {
          return Object.values(row).some((value) => {
            if (value === null || value === void 0) return false;
            return String(value).toLowerCase().includes(lowercasedSearch);
          });
        }
        const candidateKeys = fieldMap[selectedField] || [];
        return candidateKeys.some((key) => String((row == null ? void 0 : row[key]) ?? "").toLowerCase().includes(lowercasedSearch));
      })();
      if (!matchesSearch) return false;
      const portfolioValue = normalizeValue(getRowValue(row, fieldMap.portfolio));
      const bucketValue = normalizeValue(getRowValue(row, fieldMap.bucket));
      const authValue = normalizeValue(getRowValue(row, fieldMap.auth));
      const odValue = parseNumericValue(getRowValue(row, fieldMap.od_amount));
      const osValue = parseNumericValue(getRowValue(row, fieldMap.os_amount));
      if (filters.portfolio && !portfolioValue.includes(normalizeValue(filters.portfolio))) return false;
      if (filters.bucket && bucketValue !== normalizeValue(filters.bucket)) return false;
      if (filters.status && authValue !== normalizeValue(filters.status)) return false;
      if (filters.odMin && (odValue === null || odValue < Number(filters.odMin))) return false;
      if (filters.odMax && (odValue === null || odValue > Number(filters.odMax))) return false;
      if (filters.osMin && (osValue === null || osValue < Number(filters.osMin))) return false;
      if (filters.osMax && (osValue === null || osValue > Number(filters.osMax))) return false;
      const activeRules = rules.filter((rule) => rule.field && String(rule.value ?? "").trim() !== "");
      if (!activeRules.length) return true;
      return activeRules.reduce((result, rule, index) => {
        const current = evaluateRule(row, rule);
        if (index === 0) return current;
        return rule.connector === "OR" ? result || current : result && current;
      }, true);
    });
  }, [evaluateRule, fieldMap]);
  const searchCriteriaCount = reactExports.useMemo(() => {
    return Boolean(searchTerm.trim()) || getAdvancedFilterCount(advancedFilters, advancedRules) > 0;
  }, [advancedFilters, advancedRules, searchTerm]);
  const displayRows = reactExports.useMemo(() => {
    const rows = isSearchApplied ? filteredRows : allRows;
    return Array.isArray(rows) ? rows : [];
  }, [isSearchApplied, filteredRows, allRows]);
  const searchFieldOptions = reactExports.useMemo(
    () => [
      { value: "account_no", label: "Account No" },
      { value: "customer_no", label: "Customer No" },
      { value: "name", label: "Name" }
    ],
    []
  );
  const savedFilterOptions = reactExports.useMemo(
    () => savedFilters.map((filter) => ({ value: getSavedFilterId(filter), label: getSavedFilterName(filter) })).filter((option) => option.value),
    [savedFilters]
  );
  const pageSizeOptions = reactExports.useMemo(
    () => [5, 10, 15, 20].map((size) => ({ value: size, label: String(size) })),
    []
  );
  reactExports.useEffect(() => {
    if (!isSearchApplied) {
      setFilteredRows(allRows);
    }
  }, [allRows, isSearchApplied]);
  reactExports.useEffect(() => {
    allRowsRef.current = Array.isArray(allRows) ? allRows : [];
  }, [allRows]);
  reactExports.useEffect(() => {
    totalRecordsRef.current = Number(totalRecords) || 0;
  }, [totalRecords]);
  reactExports.useEffect(() => {
    isSearchAppliedRef.current = isSearchApplied;
  }, [isSearchApplied]);
  const gridModeKey = isSearchApplied ? "search-results" : "infinite-list";
  const isAnyPanelOpen = isAdvancedSearchOpen || isAdvancedSortOpen;
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const getSearchFieldKeys = reactExports.useCallback((field) => {
    const map = {
      account_no: ["ACT_NO"],
      customer_no: ["CUST_NO"],
      name: ["NAME", "CUST_NM", "CUSTOMER_NAME"]
    };
    return map[field] || [];
  }, []);
  const buildSortJson = reactExports.useCallback((rules = sortRules) => {
    return (Array.isArray(rules) ? rules : []).filter((rule) => String((rule == null ? void 0 : rule.field) ?? "").trim()).map((rule) => ({
      key: String(rule.field ?? "").trim().toUpperCase(),
      order: String(rule.order ?? "asc").trim().toLowerCase()
    }));
  }, [sortRules]);
  const buildSearchPayload = reactExports.useCallback((overrides = {}) => {
    const search = overrides.searchTerm !== void 0 ? overrides.searchTerm : searchTerm;
    const field = overrides.searchField !== void 0 ? overrides.searchField : searchField;
    const filters = overrides.advancedFilters !== void 0 ? overrides.advancedFilters : advancedFilters;
    const rules = overrides.advancedRules !== void 0 ? overrides.advancedRules : advancedRules;
    const sortRuleSet = overrides.sortRules !== void 0 ? overrides.sortRules : sortRules;
    const payload = buildFilterPayload({ filterName: "", advancedFilters: filters, rules, entityAttributes });
    const trimmedSearch = String(search ?? "").trim();
    const filterList = [...payload.filters];
    if (trimmedSearch) {
      if (field === "all") {
        filterList.push({ key: "GLOBAL_SEARCH", opt: "LIKE", value: trimmedSearch });
      } else {
        const keys = getSearchFieldKeys(field);
        if (keys.length) {
          keys.forEach((key) => {
            filterList.push({ key, opt: "LIKE", value: trimmedSearch });
          });
        } else {
          filterList.push({ key: field, opt: "LIKE", value: trimmedSearch });
        }
      }
    }
    return {
      listId: "ACLST",
      userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
      moduleName: "COL",
      viewCode: "ACLST_DEF",
      viewName: "Default View",
      filterJson: filterList,
      sortJson: buildSortJson(sortRuleSet),
      pageNumber: 1,
      pageSize: ACCOUNTLIST_BACKEND_PAGE_SIZE
    };
  }, [advancedFilters, advancedRules, buildSortJson, getSearchFieldKeys, searchField, searchTerm, sortRules]);
  const fetchTotalCount = reactExports.useCallback(async (payload) => {
    var _a2, _b;
    try {
      const response = await Kr.GET(`${ColListingAPI.ListView(screenMenuId)}/fetchListDataCount`, { params: payload });
      const raw = (_a2 = response == null ? void 0 : response.data) == null ? void 0 : _a2.responseJson;
      const resolvedTotal = Number(
        ((_b = response == null ? void 0 : response.data) == null ? void 0 : _b.totalCount) ?? (raw == null ? void 0 : raw.totalCount) ?? (raw == null ? void 0 : raw.count) ?? (raw == null ? void 0 : raw.total) ?? raw ?? 0
      );
      return Number.isFinite(resolvedTotal) && resolvedTotal > 0 ? resolvedTotal : 0;
    } catch (error2) {
      console.warn("Failed to fetch list data count", error2);
      return 0;
    }
  }, []);
  const resolveDynamicBlockSize = reactExports.useCallback(() => {
    return ACCOUNTLIST_BACKEND_PAGE_SIZE;
  }, []);
  const hasActualSearchCriteria = reactExports.useCallback((overrides = {}) => {
    const search = overrides.searchTerm !== void 0 ? overrides.searchTerm : searchTerm;
    const filters = overrides.advancedFilters !== void 0 ? overrides.advancedFilters : advancedFilters;
    const rules = overrides.advancedRules !== void 0 ? overrides.advancedRules : advancedRules;
    const sortRuleSet = overrides.sortRules !== void 0 ? overrides.sortRules : sortRules;
    const hasSearchText = String(search ?? "").trim().length > 0;
    const hasAdvancedFilters = Object.values(filters || {}).some((value) => String(value ?? "").trim().length > 0);
    const hasAdvancedRules = Array.isArray(rules) && rules.some((rule) => String((rule == null ? void 0 : rule.field) ?? "").trim() && String((rule == null ? void 0 : rule.value) ?? "").trim());
    const hasSortRules = Array.isArray(sortRuleSet) && sortRuleSet.some((rule) => String((rule == null ? void 0 : rule.field) ?? "").trim());
    return hasSearchText || hasAdvancedFilters || hasAdvancedRules || hasSortRules;
  }, [advancedFilters, advancedRules, searchTerm, sortRules]);
  const handleSearchAccounts = reactExports.useCallback(async (overrides = {}) => {
    var _a2;
    const shouldKeepSearchState = overrides.resetView !== true;
    const shouldAllowEmptySearch = overrides.resetView === true;
    if (!shouldAllowEmptySearch && !hasActualSearchCriteria(overrides)) {
      return;
    }
    setIsLoading(true);
    setError(null);
    const requestBody = buildSearchPayload(overrides);
    try {
      const totalFromCountApi = await fetchTotalCount(requestBody);
      const response = await Kr.GET(`${ColListingAPI.ListView(screenMenuId)}/fetchListData`, { params: requestBody });
      if (((_a2 = response == null ? void 0 : response.data) == null ? void 0 : _a2.status) === "SUCCESS") {
        const rows = response.data.responseJson ?? [];
        const total = totalFromCountApi || response.data.totalCount || rows.length;
        setAllRows(rows);
        setFilteredRows(rows);
        setIsSearchApplied(shouldKeepSearchState);
        setTotalRecords(total);
        setGridCacheBlockSize(resolveDynamicBlockSize(total, pageSize));
        setIsAdvancedSearchOpen(false);
      } else {
        setAllRows([]);
        setTotalRecords(0);
        setGridCacheBlockSize(resolveDynamicBlockSize(0, pageSize));
      }
    } catch (error2) {
      console.error("Search request failed", error2);
      setError(error2.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [buildSearchPayload, hasActualSearchCriteria, fetchTotalCount, resolveDynamicBlockSize, pageSize]);
  const applySavedFilter = reactExports.useCallback((selectedFilter, options = {}) => {
    if (!selectedFilter) return;
    try {
      const parsedCriteria = parseSavedFilterCriteria(selectedFilter, entityAttributes);
      if (!parsedCriteria) return;
      setSelectedSavedFilterId(getSavedFilterId(selectedFilter));
      setSearchTerm("");
      setSearchField("account_no");
      setAdvancedFilters(parsedCriteria.advancedFilters);
      setAdvancedRules(parsedCriteria.advancedRules);
      setAdvancedSortRules(parsedCriteria.sortRules || [{ id: "1", field: "", order: "asc" }]);
      if (options.runSearch !== false) {
        handleSearchAccounts({
          searchTerm: "",
          searchField: "account_no",
          advancedFilters: parsedCriteria.advancedFilters,
          advancedRules: parsedCriteria.advancedRules,
          sortRules: parsedCriteria.sortRules || [{ id: "1", field: "", order: "asc" }]
        });
      }
    } catch (error2) {
      console.error("Failed to apply saved filter:", error2);
    }
  }, [entityAttributes, handleSearchAccounts]);
  const handleSavedFilterChange = reactExports.useCallback((event) => {
    const filterId = event.target.value;
    if (!filterId) {
      return;
    }
    const selectedFilter = savedFilters.find((filter) => getSavedFilterId(filter) === filterId);
    applySavedFilter(selectedFilter);
  }, [applySavedFilter, savedFilters]);
  const handleDeleteSavedFilter = reactExports.useCallback((filterId) => {
    setSavedFilters((prev) => prev.filter((filter) => getSavedFilterId(filter) !== filterId));
  }, []);
  const handleAdvancedFilterChange = reactExports.useCallback((key, value) => {
    setAdvancedFilters((prev) => ({ ...prev, [key]: value }));
  }, []);
  const handleRuleChange = reactExports.useCallback((id, key, value) => {
    setAdvancedRules((prev) => prev.map((rule) => rule.id === id ? { ...rule, [key]: value } : rule));
  }, []);
  const handleAddRule = reactExports.useCallback(() => {
    setAdvancedRules((prev) => [
      ...prev,
      {
        ...DEFAULT_ADVANCED_RULE,
        id: `${Date.now()}-${prev.length + 1}`
      }
    ]);
  }, []);
  const handleRemoveRule = reactExports.useCallback((id) => {
    setAdvancedRules((prev) => prev.length === 1 ? prev : prev.filter((rule) => rule.id !== id));
  }, []);
  const handleAdvancedSortRuleChange = reactExports.useCallback((id, key, value) => {
    setAdvancedSortRules((prev) => prev.map((rule) => rule.id === id ? { ...rule, [key]: value } : rule));
  }, []);
  const handleAddAdvancedSortRule = reactExports.useCallback(() => {
    setAdvancedSortRules((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length + 1}`,
        field: "",
        order: "asc"
      }
    ]);
  }, []);
  const handleRemoveAdvancedSortRule = reactExports.useCallback((id) => {
    setAdvancedSortRules((prev) => prev.length === 1 ? prev : prev.filter((rule) => rule.id !== id));
  }, []);
  const handleSortRuleChange = reactExports.useCallback((id, key, value) => {
    setSortRules((prev) => prev.map((rule) => rule.id === id ? { ...rule, [key]: value } : rule));
  }, []);
  const handleReplaceSortRules = reactExports.useCallback((nextRules = []) => {
    const normalizedRules = Array.isArray(nextRules) && nextRules.length ? nextRules.map((rule, index) => ({
      id: (rule == null ? void 0 : rule.id) || `sort-${Date.now()}-${index + 1}`,
      field: String((rule == null ? void 0 : rule.field) ?? "").trim(),
      order: String((rule == null ? void 0 : rule.order) ?? "asc").trim().toLowerCase() || "asc"
    })) : [{ id: "1", field: "", order: "asc" }];
    setSortRules(normalizedRules);
  }, []);
  const handleAddSortRule = reactExports.useCallback(() => {
    setSortRules((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length + 1}`,
        field: "",
        order: "asc"
      }
    ]);
  }, []);
  const handleRemoveSortRule = reactExports.useCallback((id) => {
    setSortRules((prev) => prev.length === 1 ? prev : prev.filter((rule) => rule.id !== id));
  }, []);
  const handleDeleteSavedSort = reactExports.useCallback((sortId) => {
    setSavedSorts((prev) => prev.filter((sort) => ((sort == null ? void 0 : sort.listViewCode) || (sort == null ? void 0 : sort.viewCode)) !== sortId));
  }, []);
  const handleClearAdvancedSearch = reactExports.useCallback(() => {
    setAdvancedFilters(buildAdvancedFiltersState(entityAttributes));
    setAdvancedRules([DEFAULT_ADVANCED_RULE]);
    setAdvancedSortRules([{ id: "1", field: "", order: "asc" }]);
  }, [entityAttributes]);
  const handleClearAdvancedSearchAndSort = reactExports.useCallback(() => {
    setAdvancedFilters(buildAdvancedFiltersState(entityAttributes));
    setAdvancedRules([DEFAULT_ADVANCED_RULE]);
    setAdvancedSortRules([{ id: "1", field: "", order: "asc" }]);
  }, [entityAttributes]);
  const handleClearSort = reactExports.useCallback(() => {
    setSortRules([{ id: "1", field: "", order: "asc" }]);
  }, []);
  const handleApplySort = reactExports.useCallback(() => {
    setIsAdvancedSortOpen(false);
    handleSearchAccounts({ sortRules });
  }, [handleSearchAccounts, sortRules]);
  const resetAllFilters = reactExports.useCallback(async () => {
    const clearedSortRules = [{ id: "1", field: "", order: "asc" }];
    setSearchTerm("");
    setSearchField("account_no");
    setSelectedSavedFilterId("");
    setAdvancedFilters(buildAdvancedFiltersState(entityAttributes));
    setAdvancedRules([DEFAULT_ADVANCED_RULE]);
    setAdvancedSortRules(clearedSortRules);
    setSortRules(clearedSortRules);
    setIsAdvancedSearchOpen(false);
    setIsAdvancedSortOpen(false);
    setIsSearchApplied(false);
    setFilteredRows([]);
    await handleSearchAccounts({
      searchTerm: "",
      searchField: "account_no",
      advancedFilters: buildAdvancedFiltersState(entityAttributes),
      advancedRules: [DEFAULT_ADVANCED_RULE],
      sortRules: clearedSortRules,
      resetView: true
    });
  }, [entityAttributes, handleSearchAccounts]);
  const clearSearch = () => {
    setSearchTerm("");
  };
  reactExports.useEffect(() => {
    const fetchData = async () => {
      var _a2, _b, _c, _d, _e, _f, _g;
      try {
        setIsLoading(true);
        setError(null);
        const templateBody = { listId: "ACLST", userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM", moduleName: "COL", defViewCode: "ACLST_DEF" };
        const templateResponse = await Kr.GET(`${ColListingAPI.ListView(screenMenuId)}/fetchListTemplate`, { params: templateBody });
        if (((_a2 = templateResponse == null ? void 0 : templateResponse.data) == null ? void 0 : _a2.status) === "SUCCESS") {
          const fetchedAttributes = ((_d = (_c = (_b = templateResponse.data.responseJson) == null ? void 0 : _b.listView) == null ? void 0 : _c[0]) == null ? void 0 : _d.lstAttribute) || [];
          const fetchedEntityAttributes = ((_e = templateResponse.data.responseJson) == null ? void 0 : _e.listEntityAttribute) || [];
          setAttributes(fetchedAttributes);
          setEntityAttributes(fetchedEntityAttributes);
          setAdvancedFilters(buildAdvancedFiltersState(fetchedEntityAttributes));
          const quickFilterOptions = fetchedEntityAttributes.filter((attr) => String((attr == null ? void 0 : attr.szType) || "").includes("Q"));
          const iconCfg = ICON_CONFIG(colors2);
          const savedViews = Array.isArray((_f = templateResponse.data.responseJson) == null ? void 0 : _f.savedFilters) ? templateResponse.data.responseJson.savedFilters : [];
          const mergedSavedViews = mergeSavedViews(savedViews);
          const filteredSavedViews = mergedSavedViews.filter(
            (item) => (item == null ? void 0 : item.filterJson) != null && String(item.filterJson).trim() !== ""
          );
          const sortedSavedViews = mergedSavedViews.filter(
            (item) => (item == null ? void 0 : item.sortJson) != null && String(item.sortJson).trim() !== "" && (!(item == null ? void 0 : item.filterJson) || String(item.filterJson).trim() === "")
          );
          setSavedFilters(filteredSavedViews);
          setSavedSorts(sortedSavedViews);
          const buildColumn = (attr, overrides = {}) => {
            if (!attr) return null;
            const translationKey = TRANSLATION_KEYS[attr.szAttributeCode] || TRANSLATION_KEYS[attr.szAttributeDesc] || attr.szAttributeDesc;
            const alignment = getAlignmentForColumn(attr.szAttributeCode, attr.szAttributeDesc);
            const valueFormatter = getValueFormatterForColumn(attr.szAttributeCode, attr.szAttributeDesc);
            return {
              field: attr.szAttributeCode,
              headerName: intl.formatMessage({ id: translationKey, defaultMessage: attr.szAttributeDesc }),
              sortable: true,
              filter: true,
              resizable: true,
              hide: attr.szType === "H",
              tooltipValueGetter: (params) => {
                var _a3;
                const originalValue = (_a3 = params.data) == null ? void 0 : _a3[attr.szAttributeCode];
                return `${attr.szAttributeDesc}: ${originalValue || "N/A"}`;
              },
              valueFormatter,
              cellStyle: {
                textAlign: alignment,
                fontFamily: alignment === "right" ? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" : void 0
              },
              width: isMobile ? 110 : 132,
              minWidth: isMobile ? 84 : 96,
              ...overrides
            };
          };
          const accountNoAttr = findAttribute(fetchedAttributes, isAccountNoField);
          const customerNoAttr = findAttribute(fetchedAttributes, isCustomerNoField);
          const nameAttr = findAttribute(fetchedAttributes, isNameField);
          const portfolioAttr = findAttribute(fetchedAttributes, isPortfolioField);
          const bucketAttr = findAttribute(fetchedAttributes, isBucketField);
          const osAmountAttr = findAttribute(fetchedAttributes, isOsAmountField);
          const odAmountAttr = findAttribute(fetchedAttributes, isOdAmountField);
          const gridColumns = [
            {
              colId: "drs_status",
              field: "drs_status",
              headerName: intl.formatMessage({
                id: "label.listview.status",
                defaultMessage: "Status"
              }),
              sortable: false,
              filter: false,
              resizable: false,
              suppressMenu: true,
              headerClass: "ag-center-aligned-header",
              width: 90,
              minWidth: 90,
              maxWidth: 90,
              cellStyle: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 6px"
              },
              cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusCell, { row: params.data, iconConfig: iconCfg })
            },
            buildColumn(accountNoAttr, {
              flex: 1,
              minWidth: 120,
              cellClass: "drs-account-no-cell",
              cellStyle: {
                fontWeight: 500,
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
                padding: "2px 6px"
              }
            }),
            buildColumn(customerNoAttr, {
              flex: 1,
              minWidth: 120,
              cellClass: "drs-customer-no-cell",
              cellStyle: {
                fontWeight: 400,
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
                padding: "2px 6px"
              }
            }),
            buildColumn(nameAttr, {
              flex: 1,
              minWidth: 140,
              cellStyle: {
                color: "var(--drs-text-primary, #0f172a)",
                fontWeight: 500,
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif"
              },
              cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(NameCell, { value: params.value, row: params.data })
            }),
            buildColumn(portfolioAttr, {
              flex: 1,
              minWidth: 104,
              cellStyle: {
                color: "var(--drs-text-secondary, #334155)",
                fontWeight: 400,
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif"
              }
            }),
            buildColumn(bucketAttr, {
              width: 96,
              minWidth: 96,
              headerClass: "ag-center-aligned-header",
              cellClass: "drs-bucket-cell",
              cellStyle: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              cellRenderer: (params) => {
                const bucketTone = getBucketToneIndex(params.value, 12);
                return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `drs-bucket-badge drs-bucket-tone-${bucketTone}`, children: params.value });
              }
            }),
            buildColumn(osAmountAttr, {
              flex: 1,
              minWidth: 120,
              headerClass: "ag-right-aligned-header",
              cellClass: "ag-right-aligned-cell",
              cellStyle: (params) => {
                const isHighRisk = params.data && params.data.BKT && Number(params.data.BKT) > 6;
                return {
                  textAlign: "right",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  color: isHighRisk ? "var(--destructive, #ef4444) !important" : "var(--drs-text-primary, #0f172a)",
                  fontSize: "12px",
                  fontWeight: isHighRisk ? 600 : 400
                };
              }
            }),
            buildColumn(odAmountAttr, {
              flex: 1,
              minWidth: 130,
              headerClass: "ag-right-aligned-header",
              cellClass: "ag-right-aligned-cell",
              cellStyle: (params) => {
                const isHighRisk = params.data && params.data.BKT && Number(params.data.BKT) > 6;
                return {
                  textAlign: "right",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  color: isHighRisk ? "var(--destructive, #ef4444) !important" : "var(--drs-text-primary, #0f172a)",
                  fontSize: "12px",
                  fontWeight: isHighRisk ? 600 : 400
                };
              }
            })
          ].filter(Boolean);
          gridColumns.push({
            colId: "drs_actions",
            field: "drs_actions",
            headerName: intl.formatMessage({
              id: "label.listview.actions",
              defaultMessage: "Actions"
            }),
            sortable: false,
            filter: false,
            resizable: true,
            headerClass: "ag-center-aligned-header",
            suppressMenu: true,
            suppressAutoSize: true,
            cellClass: "drs-actions-col-wrap",
            width: 96,
            minWidth: 96,
            maxWidth: 96,
            cellStyle: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 6px",
              overflow: "visible"
            },
            cellRenderer: (params) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              AccountListActionsCell,
              {
                params,
                intl,
                isDark: theme.palette.mode === "dark",
                onView: () => handleViewAccount(params.data),
                onFollowUp: () => handleFollowUp(params.data),
                onCall: () => handleCall(params.data),
                onSms: () => handleSms(params.data)
              }
            )
          });
          setColumnDefs(gridColumns);
          const dataBody = {
            listId: "ACLST",
            userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
            moduleName: "COL",
            viewCode: "ACLST_DEF",
            viewName: "Default View",
            filterJson: [],
            sortJson: [],
            pageNumber: 1,
            pageSize: ACCOUNTLIST_BACKEND_PAGE_SIZE
          };
          const totalFromCountApi = await fetchTotalCount(dataBody);
          const dataResponse = await Kr.GET(`${ColListingAPI.ListView(screenMenuId)}/fetchListData`, { params: dataBody });
          if (((_g = dataResponse == null ? void 0 : dataResponse.data) == null ? void 0 : _g.status) === "SUCCESS") {
            const rows = dataResponse.data.responseJson ?? [];
            const total = totalFromCountApi || dataResponse.data.totalCount || rows.length;
            setAllRows(rows);
            setTotalRecords(total);
            setGridCacheBlockSize(resolveDynamicBlockSize(total, pageSize));
          } else {
            setAllRows([]);
            setTotalRecords(0);
            setGridCacheBlockSize(resolveDynamicBlockSize(0, pageSize));
          }
        } else {
          setError("Failed to fetch column metadata");
        }
      } catch (error2) {
        console.error("Error fetching data", error2);
        setError(error2.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [
    language,
    intl,
    getAlignmentForColumn,
    getValueFormatterForColumn,
    isMobile,
    handleViewAccount,
    handleFollowUp,
    handleCall,
    handleSms,
    theme.palette.mode,
    fetchTotalCount,
    resolveDynamicBlockSize
  ]);
  const loadMoreData = reactExports.useCallback(async (startRow, endRow) => {
    var _a2;
    try {
      const backendPageSize = ACCOUNTLIST_BACKEND_PAGE_SIZE;
      const pageNumber = Math.floor(startRow / backendPageSize) + 1;
      const requestBody = {
        listId: "ACLST",
        userId: sessionStorage.getItem("SEC_USERNAME") || "SYSTEM",
        moduleName: "COL",
        viewCode: "ACLST_DEF",
        viewName: "Default View",
        filterJson: [],
        sortJson: [],
        pageNumber,
        pageSize: backendPageSize
      };
      const response = await Kr.GET(`${ColListingAPI.ListView(screenMenuId)}/fetchListData`, { params: requestBody });
      if (((_a2 = response == null ? void 0 : response.data) == null ? void 0 : _a2.status) === "SUCCESS") {
        const newRows = response.data.responseJson ?? [];
        const latestTotal = response.data.totalCount || totalRecords;
        setAllRows((prevRows) => {
          const updatedRows = [...prevRows];
          newRows.forEach((row, index) => {
            updatedRows[startRow + index] = row;
          });
          return updatedRows;
        });
        if (latestTotal && latestTotal !== totalRecords) {
          setTotalRecords(latestTotal);
          setGridCacheBlockSize(resolveDynamicBlockSize(latestTotal, pageSize));
        }
        return { success: true, rows: newRows, total: latestTotal || totalRecords };
      } else {
        return { success: true, rows: [], total: 0 };
      }
    } catch (error2) {
      console.error("Failed to load more data", error2);
      return { success: false };
    }
  }, [totalRecords, resolveDynamicBlockSize]);
  reactExports.useEffect(() => {
    setGridCacheBlockSize(resolveDynamicBlockSize(totalRecords, pageSize));
  }, [pageSize, totalRecords, resolveDynamicBlockSize]);
  const datasource = reactExports.useMemo(() => ({
    getRows: async (params) => {
      const { startRow, endRow } = params;
      console.log("Datasource getRows:", { startRow, endRow });
      if (isSearchAppliedRef.current) {
        const rowsSnapshot2 = allRowsRef.current;
        params.successCallback(
          rowsSnapshot2.slice(startRow, endRow),
          totalRecordsRef.current
        );
        return;
      }
      const rowsSnapshot = allRowsRef.current;
      const totalSnapshot = totalRecordsRef.current;
      const requestedSize = Math.max(0, endRow - startRow);
      const hasFullSegment = (() => {
        if (!Array.isArray(rowsSnapshot) || rowsSnapshot.length < endRow) return false;
        for (let i = startRow; i < endRow; i += 1) {
          if (!(i in rowsSnapshot)) return false;
          const row = rowsSnapshot[i];
          if (row === void 0 || row === null) return false;
        }
        return true;
      })();
      if (hasFullSegment) {
        const existingRows = rowsSnapshot.slice(startRow, endRow);
        if (existingRows.length !== requestedSize) {
          const result2 = await loadMoreData(startRow, endRow);
          if (result2.success) {
            params.successCallback(result2.rows, result2.total);
          } else {
            params.failCallback();
          }
          return;
        }
        console.log("Returning existing rows:", existingRows.length);
        params.successCallback(existingRows, totalSnapshot);
        return;
      }
      console.log("Loading more data...");
      const result = await loadMoreData(startRow, endRow);
      if (result.success) {
        params.successCallback(result.rows, result.total);
      } else {
        params.failCallback();
      }
    }
  }), [loadMoreData]);
  const gridRowData = isSearchApplied ? displayRows : null;
  reactExports.useEffect(() => {
    var _a2, _b, _c, _d, _e, _f, _g;
    const api = gridApiRef.current;
    if (!api) return;
    (_a2 = api.paginationSetPageSize) == null ? void 0 : _a2.call(api, pageSize);
    if (isSearchApplied) {
      (_b = api.setGridOption) == null ? void 0 : _b.call(api, "datasource", null);
      (_c = api.setGridOption) == null ? void 0 : _c.call(api, "rowData", gridRowData);
    } else {
      (_d = api.setGridOption) == null ? void 0 : _d.call(api, "rowData", null);
      (_e = api.setGridOption) == null ? void 0 : _e.call(api, "datasource", datasource);
      (_f = api.purgeInfiniteCache) == null ? void 0 : _f.call(api);
    }
    (_g = api.paginationGoToFirstPage) == null ? void 0 : _g.call(api);
  }, [pageSize, datasource, isSearchApplied, gridRowData]);
  const handleBulkSelectionChange = reactExports.useCallback((rows) => {
    setBulkSelectedRows(Array.isArray(rows) ? rows : []);
  }, []);
  const handleGridApiReady = reactExports.useCallback((api) => {
    gridApiRef.current = api;
  }, []);
  const clearBulkSelection = reactExports.useCallback(() => {
    var _a2, _b;
    (_b = (_a2 = gridApiRef.current) == null ? void 0 : _a2.deselectAll) == null ? void 0 : _b.call(_a2);
    setBulkSelectedRows([]);
  }, []);
  const handleBulkNavigate = reactExports.useCallback(
    (path, actionKey) => {
      const plainAccounts = bulkSelectedRows.map(extractPlainRowData);
      if (actionKey === "followup" || actionKey === "tag" || actionKey === "memo") {
        setGroupPopupState({
          open: true,
          type: actionKey,
          selectedAccounts: plainAccounts
        });
        return;
      }
      navigate(path, {
        state: { selectedAccounts: plainAccounts }
      });
    },
    [navigate, bulkSelectedRows]
  );
  const handleCloseGroupPopup = reactExports.useCallback(() => {
    setGroupPopupState({
      open: false,
      type: null,
      selectedAccounts: []
    });
  }, []);
  const handleGroupSuccess = reactExports.useCallback((processedAccounts) => {
    console.log(`Group ${groupPopupState.type} completed for`, processedAccounts == null ? void 0 : processedAccounts.length, "accounts");
    handleCloseGroupPopup();
    if (gridApiRef.current) {
      gridApiRef.current.deselectAll();
    }
    setBulkSelectedRows([]);
  }, [groupPopupState.type, handleCloseGroupPopup]);
  reactExports.useEffect(() => {
    var _a2, _b;
    (_b = (_a2 = gridApiRef.current) == null ? void 0 : _a2.deselectAll) == null ? void 0 : _b.call(_a2);
    setBulkSelectedRows([]);
    setGroupPopupState({
      open: false,
      type: null,
      selectedAccounts: []
    });
  }, [searchTerm, searchField, advancedFilters, advancedRules]);
  const gridConfig = reactExports.useMemo(
    () => ({
      ...isSearchApplied ? { rowData: gridRowData, datasource: null } : { rowData: null, datasource },
      columnDefs,
      onClickMapping: { ACT_NO: handleAccountClick },
      paginationPageSize: pageSize,
      cacheBlockSize: gridCacheBlockSize,
      fixColumns: isMobile ? 2 : 5,
      gridStyle: listGridOuterStyle,
      iconConfig: ICON_CONFIG(colors2),
      shellColors: colors2,
      enableBulkRowSelection: true,
      enableRowExpandDetail: true,
      onBulkSelectionChange: handleBulkSelectionChange,
      onGridApiReady: handleGridApiReady,
      useAccountsTableChrome: true,
      listLabel: intl.formatMessage({ id: "label.accounts.list.short", defaultMessage: "Accounts" })
    }),
    [isSearchApplied, gridRowData, datasource, columnDefs, pageSize, gridCacheBlockSize, isMobile, handleAccountClick, colors2, handleBulkSelectionChange, handleGridApiReady, intl]
  );
  reactExports.useEffect(() => {
    console.log("Filtered rows updated:", filteredRows.length);
  }, [filteredRows]);
  console.log("Grid config:", {
    useDatasource: !searchTerm,
    rowDataLength: searchTerm ? filteredRows.length : "N/A",
    columnDefsLength: columnDefs.length
  });
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { p: 3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { severity: "error", children: [
      "Error loading data: ",
      error
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Dt,
    {
      className: "drs-page-container",
      sx: {
        backgroundColor: "var(--drs-bg-default, #ffffff)",
        minHeight: 0,
        flex: "1 1 auto",
        height: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        py: 0.5,
        position: "relative"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Container,
        {
          maxWidth: false,
          sx: {
            px: isMobile ? 0.75 : 1,
            position: "relative",
            flex: 1,
            height: "100%",
            minHeight: 0,
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", maxWidth: "100%" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Kg,
              {
                elevation: 0,
                sx: {
                  borderRadius: 0,
                  backgroundColor: "var(--drs-bg-panel, #f8fafc)",
                  border: "none",
                  overflow: "visible",
                  height: "100%",
                  flex: 1,
                  minHeight: 0,
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Box,
                    {
                      sx: {
                        flexShrink: 0,
                        mx: 0,
                        mt: 1,
                        borderRadius: "10px",
                        border: `1px solid var(--drs-border-divider, ${colors2.border})`,
                        backgroundColor: "var(--drs-bg-paper, #ffffff)",
                        overflow: "hidden",
                        boxShadow: isDarkMode ? "none" : "0 1px 3px rgba(15, 23, 42, 0.06)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Box,
                          {
                            sx: {
                              ...panelThemeVars,
                              px: 2,
                              py: 1.1,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 1.5,
                              backgroundColor: isDarkMode ? "var(--drs-bg-panel, #f8fafc)" : "#ffffff",
                              minHeight: 48
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", justifyContent: "start", width: "100%" }, children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { height: 36, display: "flex", alignItems: "center", minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                SE,
                                {
                                  name: "searchField",
                                  value: searchField,
                                  onChange: (event) => setSearchField(event.target.value || "account_no"),
                                  options: searchFieldOptions,
                                  placeholder: "All Fields",
                                  disabled: isLoading,
                                  width: isMobile ? "100%" : "160px",
                                  sx: { "&& .MuiInputBase-root": { height: "36px !important" }, "& .MuiSelect-select": { py: "8px !important" } }
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { height: 36, width: 300, display: "flex", alignItems: "center", flex: "0 1 auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                ap,
                                {
                                  className: "drs-themed-textfield drs-themed-searchfield",
                                  placeholder: "Search accounts...",
                                  value: searchTerm,
                                  onChange: handleSearchChange,
                                  editable: true,
                                  disabled: isLoading,
                                  startAdornment: /* @__PURE__ */ jsxRuntimeExports.jsx(MdSearch, { size: 16, color: colors2.text.light }),
                                  width: isMobile ? "100%" : "520px",
                                  sx: {
                                    "& .MuiInputBase-root": {
                                      height: 36,
                                      fontSize: 12,
                                      borderRadius: "10px",
                                      backgroundColor: "var(--drs-bg-default, #ffffff)",
                                      color: "var(--drs-text-primary, #0f172a)"
                                    },
                                    "& .MuiInputBase-input": {
                                      py: 0.5,
                                      "&::placeholder": {
                                        color: "var(--drs-text-secondary, #64748b)",
                                        opacity: 0.8
                                      }
                                    }
                                  },
                                  InputProps: {
                                    endAdornment: searchTerm ? /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: clearSearch, size: "small", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MdClear, { size: 16 }) }) : void 0
                                  }
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { height: 36, display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Lg,
                                {
                                  label: "Search",
                                  variant: "contained",
                                  size: "small",
                                  onClick: () => handleSearchAccounts(),
                                  disabled: isLoading,
                                  startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(MdSearch, { size: 20 }),
                                  sx: { height: 36, width: "100%", borderRadius: "10px", textTransform: "none", whiteSpace: "nowrap" }
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, { orientation: "vertical", flexItem: true, sx: { my: 0, mx: 0.5, height: 36, alignSelf: "center" } }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { height: 36, display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Lg,
                                {
                                  label: `Advanced Search${getAdvancedFilterCount(advancedFilters, advancedRules) > 0 ? ` (${getAdvancedFilterCount(advancedFilters, advancedRules)})` : ""}`,
                                  variant: isAdvancedSearchOpen ? "contained" : "outlined",
                                  size: "small",
                                  onClick: () => {
                                    setIsAdvancedSearchOpen((prev) => !prev);
                                    setIsAdvancedSortOpen(false);
                                  },
                                  startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(FiSliders, { size: 14 }),
                                  endIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(FiChevronDown, { size: 14 }),
                                  sx: { height: 36, borderRadius: "10px", textTransform: "none", whiteSpace: "nowrap" }
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { height: 36, display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Lg,
                                {
                                  label: "Sort",
                                  variant: isAdvancedSortOpen ? "contained" : "outlined",
                                  size: "small",
                                  onClick: () => {
                                    setIsAdvancedSortOpen((prev) => !prev);
                                    setIsAdvancedSearchOpen(false);
                                  },
                                  startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(FiSliders, { size: 14 }),
                                  endIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(FiChevronDown, { size: 14 }),
                                  sx: { height: 36, borderRadius: "10px", textTransform: "none", whiteSpace: "nowrap" }
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { height: 36, display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Lg,
                                {
                                  label: "Reset",
                                  variant: "outlined",
                                  size: "small",
                                  onClick: resetAllFilters,
                                  disabled: !searchCriteriaCount && !isSearchApplied,
                                  sx: { height: 36, borderRadius: "10px", textTransform: "none", whiteSpace: "nowrap" }
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { height: 36, display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Lg,
                                {
                                  label: "Export",
                                  variant: "outlined",
                                  size: "small",
                                  onClick: () => {
                                  },
                                  startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(FiDownload, { size: 14 }),
                                  sx: { height: 36, borderRadius: "10px", textTransform: "none", whiteSpace: "nowrap" }
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: { height: 36, display: "flex", alignItems: "center", minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                SE,
                                {
                                  name: "savedFilter",
                                  value: selectedSavedFilterId,
                                  onChange: handleSavedFilterChange,
                                  options: savedFilterOptions,
                                  placeholder: "Saved filters",
                                  disabled: isLoading || savedFilterOptions.length === 0,
                                  width: isMobile ? "100%" : "150px",
                                  sx: { "&& .MuiInputBase-root": { height: "36px !important" }, "& .MuiSelect-select": { py: "8px !important" } }
                                }
                              ) })
                            ] })
                          }
                        ),
                        isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Box,
                          {
                            sx: {
                              display: "flex",
                              alignItems: "center",
                              px: 1.5,
                              py: 0.4,
                              borderTop: `1px solid var(--drs-border-divider, ${colors2.border})`
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { size: 14, sx: { mr: 1, color: colors2.primary } }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                ps,
                                {
                                  value: "Loading data...",
                                  translate: false,
                                  align: "left",
                                  colon: false,
                                  sx: {
                                    color: "var(--drs-text-secondary, hsl(215, 14%, 46%))",
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                    fontSize: 11
                                  }
                                }
                              )
                            ]
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Box,
                    {
                      sx: {
                        flex: 1,
                        minHeight: 0,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        overflow: "auto",
                        bgcolor: "inherit",
                        height: "100%",
                        pt: 1,
                        boxSizing: "border-box"
                      },
                      children: [
                        isAdvancedSearchOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Box,
                          {
                            sx: {
                              flexShrink: 0,
                              overflow: "hidden",
                              borderRadius: "10px",
                              border: `1px solid var(--drs-border-divider, ${colors2.border})`,
                              backgroundColor: "var(--drs-bg-paper, #ffffff)",
                              boxShadow: isDarkMode ? "none" : "0 1px 3px rgba(15, 23, 42, 0.06)"
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              AdvancedSearchPanel$1,
                              {
                                colors: colors2,
                                isMobile,
                                panelThemeVars,
                                advancedFilters,
                                onAdvancedFilterChange: handleAdvancedFilterChange,
                                rules: advancedRules,
                                onRuleChange: handleRuleChange,
                                onAddRule: handleAddRule,
                                onRemoveRule: handleRemoveRule,
                                onReset: handleClearAdvancedSearch,
                                onClear: handleClearAdvancedSearchAndSort,
                                onClose: () => setIsAdvancedSearchOpen(false),
                                onSearch: handleSearchAccounts,
                                searchCriteriaCount,
                                isLoading,
                                savedFilters,
                                attributes: entityAttributes,
                                toast,
                                onDeleteSavedFilter: handleDeleteSavedFilter,
                                entityAttributes,
                                onApplySavedFilter: applySavedFilter,
                                sortRules: advancedSortRules,
                                onSortRuleChange: handleAdvancedSortRuleChange,
                                onAddSortRule: handleAddAdvancedSortRule,
                                onRemoveSortRule: handleRemoveAdvancedSortRule
                              }
                            )
                          }
                        ),
                        isAdvancedSortOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Box,
                          {
                            sx: {
                              flexShrink: 0,
                              overflow: "hidden",
                              borderRadius: "10px",
                              border: `1px solid var(--drs-border-divider, ${colors2.border})`,
                              backgroundColor: "var(--drs-bg-paper, #ffffff)",
                              boxShadow: isDarkMode ? "none" : "0 1px 3px rgba(15, 23, 42, 0.06)"
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SortPanel$1,
                              {
                                colors: colors2,
                                isMobile,
                                panelThemeVars,
                                sortRules,
                                onSortRuleChange: handleSortRuleChange,
                                onAddSortRule: handleAddSortRule,
                                onRemoveSortRule: handleRemoveSortRule,
                                onClose: () => setIsAdvancedSortOpen(false),
                                onApplySort: handleApplySort,
                                onClear: handleClearSort,
                                isLoading,
                                savedSorts,
                                attributes: entityAttributes,
                                toast,
                                onDeleteSavedSort: handleDeleteSavedSort,
                                entityAttributes,
                                onReplaceSortRules: handleReplaceSortRules
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Box,
                          {
                            sx: {
                              flex: isAnyPanelOpen ? "0 0 auto" : 1,
                              minHeight: isAnyPanelOpen ? isMobile ? 520 : 620 : 0,
                              maxWidth: "100%",
                              display: "flex",
                              flexDirection: "column",
                              overflow: "hidden",
                              backgroundColor: "var(--drs-bg-paper, #ffffff)",
                              borderRadius: "10px",
                              border: `1px solid var(--drs-border-divider, ${colors2.border})`,
                              boxShadow: isDarkMode ? "none" : "0 1px 3px rgba(15, 23, 42, 0.06)"
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                Box,
                                {
                                  sx: {
                                    flexShrink: 0,
                                    px: 1.5,
                                    py: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    borderBottom: `1px solid var(--drs-border-divider, ${colors2.border})`,
                                    backgroundColor: isDarkMode ? "var(--drs-bg-panel, #f8fafc)" : "#ffffff"
                                  },
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      ps,
                                      {
                                        value: `${totalRecords || displayRows.length} ${intl.formatMessage({ id: "label.accounts.short", defaultMessage: "accounts" })}`,
                                        translate: false,
                                        align: "left",
                                        colon: false,
                                        sx: {
                                          fontWeight: 600,
                                          fontFamily: "'Inter', system-ui, sans-serif",
                                          fontSize: 12,
                                          color: "var(--drs-text-primary, hsl(220, 20%, 10%))",
                                          whiteSpace: "nowrap"
                                        }
                                      }
                                    ),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: { display: "flex", alignItems: "center", gap: 1 }, children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        ps,
                                        {
                                          value: "Rows:",
                                          translate: false,
                                          align: "left",
                                          colon: false,
                                          sx: {
                                            fontSize: 12,
                                            color: "var(--drs-text-secondary, hsl(215, 14%, 46%))",
                                            fontFamily: "'Inter', system-ui, sans-serif"
                                          }
                                        }
                                      ),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        SE,
                                        {
                                          name: "pageSize",
                                          value: pageSize,
                                          onChange: (event) => setPageSize(Number(event.target.value) || 15),
                                          options: pageSizeOptions,
                                          placeholder: "Rows",
                                          width: "86px"
                                        }
                                      )
                                    ] })
                                  ]
                                }
                              ),
                              isLoading && allRows.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Box, { sx: {
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                flex: 1,
                                minHeight: 200,
                                background: "inherit",
                                gap: 1.25
                              }, children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(CircularProgress, { size: 24, sx: { color: colors2.primary } }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  ps,
                                  {
                                    value: intl.formatMessage({ id: "label.loading", defaultMessage: "Loading accounts..." }),
                                    translate: false,
                                    align: "left",
                                    colon: false,
                                    sx: {
                                      color: colors2.text.secondary,
                                      fontFamily: "'Inter', sans-serif",
                                      fontSize: 12,
                                      fontWeight: 500
                                    }
                                  }
                                )
                              ] }) : columnDefs.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                Box,
                                {
                                  sx: {
                                    flex: 1,
                                    minHeight: isAnyPanelOpen ? isMobile ? 520 : 620 : 0,
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    backgroundColor: "inherit",
                                    height: "100%"
                                  },
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(HE, { ...gridConfig }, gridModeKey),
                                    bulkSelectedRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      Box,
                                      {
                                        sx: {
                                          flexShrink: 0,
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          flexWrap: "wrap",
                                          gap: 1,
                                          px: 2,
                                          py: 1,
                                          bgcolor: colors2.primary,
                                          color: "#fff",
                                          borderTop: `1px solid ${colors2.primaryDark}`
                                        },
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Stack, { direction: "row", alignItems: "center", spacing: 1.5, flexWrap: "wrap", useFlexGap: true, children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              ps,
                                              {
                                                value: `${bulkSelectedRows.length} ${bulkSelectedRows.length === 1 ? "account" : "accounts"} selected`,
                                                translate: false,
                                                align: "left",
                                                colon: false,
                                                sx: { fontSize: 13, fontWeight: 600, color: "#fff" }
                                              }
                                            ),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              Box,
                                              {
                                                sx: {
                                                  width: "1px",
                                                  height: 20,
                                                  bgcolor: "rgba(255,255,255,0.25)",
                                                  display: { xs: "none", sm: "block" }
                                                }
                                              }
                                            ),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(Stack, { direction: "row", spacing: 0.5, flexWrap: "wrap", useFlexGap: true, children: BULK_ACTIONS.map(({ key, label, icon: Icon, path }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              Button,
                                              {
                                                size: "small",
                                                onClick: () => handleBulkNavigate(path, key),
                                                startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 13 }),
                                                sx: {
                                                  color: "#fff",
                                                  textTransform: "none",
                                                  fontSize: 11,
                                                  fontWeight: 500,
                                                  minHeight: 28,
                                                  px: 1,
                                                  "&:hover": { bgcolor: "rgba(255,255,255,0.15)" }
                                                },
                                                children: label
                                              },
                                              key
                                            )) })
                                          ] }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                            Button,
                                            {
                                              size: "small",
                                              onClick: clearBulkSelection,
                                              startIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(FiX, { size: 14 }),
                                              sx: {
                                                color: "#fff",
                                                textTransform: "none",
                                                fontSize: 11,
                                                minHeight: 28,
                                                "&:hover": { bgcolor: "rgba(255,255,255,0.15)" }
                                              },
                                              children: "Clear"
                                            }
                                          )
                                        ]
                                      }
                                    )
                                  ]
                                }
                              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Box, { sx: {
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "300px",
                                background: colors2.cardBg
                              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                ps,
                                {
                                  value: "No columns defined",
                                  translate: false,
                                  align: "left",
                                  colon: false,
                                  sx: {
                                    color: colors2.text.secondary,
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: isMobile ? "15px" : "16px",
                                    fontWeight: 500
                                  }
                                }
                              ) })
                            ]
                          }
                        )
                      ]
                    }
                  )
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(LE, { open: dashboardOpen, onClose: () => setDashboardOpen(false), maxWidth: "xl", fullWidth: true, disableContentWrapper: true, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                DialogTitle,
                {
                  sx: {
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: colors2.appBarGradient,
                    color: "#fff",
                    px: 3,
                    py: 1.5
                  },
                  children: [
                    "Collector Performance Dashboard",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(IconButton, { onClick: () => setDashboardOpen(false), sx: { color: "#fff" }, "aria-label": "Close", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MdClose, {}) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CollectorDashboardRecharts, { isMobile }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GroupFollowupPopup,
              {
                open: groupPopupState.open && groupPopupState.type === "followup",
                onClose: handleCloseGroupPopup,
                selectedAccounts: groupPopupState.selectedAccounts,
                gridApiRef,
                onSuccess: handleGroupSuccess
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GroupTagPopup,
              {
                open: groupPopupState.open && groupPopupState.type === "tag",
                onClose: handleCloseGroupPopup,
                selectedAccounts: groupPopupState.selectedAccounts,
                gridApiRef,
                onSuccess: handleGroupSuccess
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              GroupMemoPopup,
              {
                open: groupPopupState.open && groupPopupState.type === "memo",
                onClose: handleCloseGroupPopup,
                selectedAccounts: groupPopupState.selectedAccounts,
                gridApiRef,
                onSuccess: handleGroupSuccess
              }
            )
          ]
        }
      )
    }
  );
};
AccountList.propTypes = {
  language: PropTypes.string
};
const AccountList_default = React.memo(AccountList);
export {
  AccountList_default as default
};

import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";
import {
  append as svgAppend,
  create as svgCreate,
  attr as svgAttr,
  classes as svgClasses
} from "tiny-svg";
import { is } from "bpmn-js/lib/util/ModelUtil";
import { designerIcon, EVENT_DEFINITION_ICONS, SHAPE_ICONS } from "./designerIcons";

/**
 * Icon-first style for Designer + all BpmnCanvas viewers:
 * - only custom PNG (no default bpmn-js marker overlap)
 * - activity name centered under the icon
 * - events/gateways keep external labels
 */

function resolveImage(element) {
  if (is(element, "bpmn:IntermediateCatchEvent") || is(element, "bpmn:IntermediateThrowEvent")) {
    const defs = element.businessObject?.eventDefinitions;
    if (!defs || defs.length === 0) {
      return is(element, "bpmn:IntermediateCatchEvent")
        ? designerIcon("wait.default.png")
        : designerIcon("notify.default.png");
    }
    return EVENT_DEFINITION_ICONS[defs[0].$type] || null;
  }

  const entry = Object.entries(SHAPE_ICONS).find(([type]) => is(element, type));
  return entry ? entry[1].image : null;
}

function isActivity(element) {
  return (
    is(element, "bpmn:Task") ||
    is(element, "bpmn:CallActivity") ||
    is(element, "bpmn:SubProcess") ||
    is(element, "bpmn:DataStoreReference")
  );
}

function makeIconImage(imageSrc, x, y, size) {
  const image = svgCreate("image");
  svgAttr(image, {
    href: imageSrc,
    xlinkHref: imageSrc,
    x,
    y,
    width: size,
    height: size,
    preserveAspectRatio: "xMidYMid meet",
    style: "pointer-events: none"
  });
  image.style.pointerEvents = "none";
  return image;
}

export default class CustomIconRenderer extends BaseRenderer {
  constructor(eventBus, textRenderer) {
    super(eventBus, 1500);
    this.textRenderer = textRenderer;
  }

  canRender(element) {
    if (!element || element.labelTarget) return false;
    return !!resolveImage(element);
  }

  drawShape(parentNode, element) {
    const imageSrc = resolveImage(element);
    const w = element.width || 80;
    const h = element.height || 80;
    const activity = isActivity(element);

    // Invisible hit target — stroke kept so Graphical Log status colors still apply
    const hit = svgCreate("rect");
    svgAttr(hit, {
      x: 0,
      y: 0,
      width: w,
      height: h,
      rx: 4,
      ry: 4,
      fill: "rgba(255,255,255,0.001)",
      stroke: "transparent",
      "stroke-width": 2
    });
    svgAppend(parentNode, hit);

    // Activities: reserve bottom band for the name (icon above, label below)
    // Events / gateways: icon fills the shape; name uses external label
    const labelBand = activity ? Math.max(20, Math.round(h * 0.28)) : 0;
    const maxIcon = activity ? 56 : Math.min(w, h);
    const iconSize = Math.min(maxIcon, w - 6, h - labelBand - (activity ? 4 : 0));
    const iconX = Math.round((w - iconSize) / 2);
    const iconY = activity
      ? Math.max(2, Math.round((h - labelBand - iconSize) / 2))
      : Math.round((h - iconSize) / 2);

    svgAppend(parentNode, makeIconImage(imageSrc, iconX, iconY, iconSize));

    if (activity) {
      const name = element.businessObject?.name;
      if (name) {
        const labelTop = iconY + iconSize + 2;
        const text = this.textRenderer.createText(name, {
          box: {
            x: 0,
            y: 0,
            width: Math.max(40, w - 4),
            height: Math.max(18, h - labelTop)
          },
          align: "center-top",
          padding: 0,
          style: {
            fill: "#1e293b",
            fontSize: "12px",
            fontFamily: "Arial, sans-serif",
            fontWeight: "500"
          }
        });
        svgClasses(text).add("djs-label");
        svgClasses(text).add("designer-activity-label");
        svgAttr(text, {
          transform: `translate(2, ${labelTop})`
        });
        text.style.pointerEvents = "none";
        svgAppend(parentNode, text);
      }
    }

    return hit;
  }
}

CustomIconRenderer.$inject = ["eventBus", "textRenderer"];

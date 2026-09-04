import { CONTEXT_PAD_ICONS } from "./designerIcons";

export default class CustomContextPadProvider {
  constructor(contextPad) {
    contextPad.registerProvider(500, this);
  }

  getContextPadEntries() {
    return (entries) => {
      Object.entries(CONTEXT_PAD_ICONS).forEach(([key, imageUrl]) => {
        if (entries[key]) {
          delete entries[key].className;
          entries[key].imageUrl = imageUrl;
        }
      });

      return entries;
    };
  }
}

CustomContextPadProvider.$inject = ["contextPad"];

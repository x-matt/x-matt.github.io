"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ImageRenamerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/settings/Settings.ts
var DEFAULT_SETTINGS = {
  nameTemplate: "{{original}}",
  dateFormat: "YYYY-MM-DD",
  timeFormat: "HHmmss",
  defaultFolder: "attachments",
  variableDefaults: {},
  autoRenamePaste: true,
  autoRenameDrop: true,
  imageFormats: ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"],
  trashFolder: ".trash-images",
  language: "en"
};

// src/settings/SettingTab.ts
var import_obsidian = require("obsidian");

// src/i18n/index.ts
var zh = {
  // --- Commands ---
  "command.organize-current": "\u6574\u7406\u5F53\u524D\u7B14\u8BB0\u7684\u56FE\u7247",
  "command.organize-all": "\u6574\u7406\u6240\u6709\u7B14\u8BB0\u7684\u56FE\u7247",
  "command.find-unreferenced": "\u67E5\u627E\u672A\u88AB\u5F15\u7528\u7684\u56FE\u7247",
  // --- Notices (use {{n}} for numeric placeholders) ---
  "notice.organized": "\u5DF2\u6574\u7406 {{n}} \u5F20\u56FE\u7247",
  "notice.no-unreferenced": "\u6CA1\u6709\u627E\u5230\u672A\u5F15\u7528\u7684\u56FE\u7247",
  "notice.trashed": "\u5DF2\u79FB\u52A8 {{n}} \u5F20\u56FE\u7247\u5230\u56DE\u6536\u6587\u4EF6\u5939",
  "notice.deleted": "\u5DF2\u6C38\u4E45\u5220\u9664 {{n}} \u5F20\u56FE\u7247",
  "notice.please-select": "\u8BF7\u5148\u9009\u62E9\u56FE\u7247",
  "notice.operation-failed": "\u64CD\u4F5C\u5931\u8D25: {{msg}}",
  "notice.unknown-error": "\u672A\u77E5\u9519\u8BEF",
  // --- Settings sections ---
  "settings.section-naming": "\u547D\u540D\u8BBE\u7F6E",
  "settings.section-variable-defaults": "\u53D8\u91CF\u9ED8\u8BA4\u503C",
  "settings.section-variable-desc": "\u5F53\u7B14\u8BB0 frontmatter \u4E2D\u7F3A\u5C11\u5BF9\u5E94\u5C5E\u6027\u65F6\u4F7F\u7528\u7684\u9ED8\u8BA4\u503C\u3002",
  "settings.section-storage": "\u5B58\u50A8\u8BBE\u7F6E",
  "settings.section-processing": "\u5904\u7406\u8BBE\u7F6E",
  "settings.section-cleanup": "\u6E05\u7406\u8BBE\u7F6E",
  "settings.section-language": "\u8BED\u8A00\u8BBE\u7F6E",
  // --- Settings: naming ---
  "settings.name-template": "\u56FE\u7247\u547D\u540D\u6A21\u677F",
  "settings.name-template-desc": "\u652F\u6301 {{date}}, {{time}}, {{datetime}}, {{random}}, {{counter}}, {{original}}, {{filename}} \u4EE5\u53CA frontmatter \u81EA\u5B9A\u4E49\u53D8\u91CF\u3002\u53EF\u7528\u5192\u53F7\u8BBE\u7F6E\u9ED8\u8BA4\u503C\uFF1A{{topic:general}}",
  "settings.date-format": "\u65E5\u671F\u683C\u5F0F",
  "settings.date-format-desc": "\u7528\u4E8E {{date}}\uFF0C\u5982 YYYY-MM-DD",
  "settings.time-format": "\u65F6\u95F4\u683C\u5F0F",
  "settings.time-format-desc": "\u7528\u4E8E {{time}}\uFF0C\u5982 HHmmss",
  // --- Settings: variable defaults ---
  "settings.add-default": "\u6DFB\u52A0\u9ED8\u8BA4\u503C",
  "settings.var-name-placeholder": "\u53D8\u91CF\u540D",
  "settings.var-value-placeholder": "\u9ED8\u8BA4\u503C",
  "settings.delete": "\u5220\u9664",
  "settings.add": "\u6DFB\u52A0",
  // --- Settings: storage ---
  "settings.default-folder": "\u9ED8\u8BA4\u56FE\u7247\u6587\u4EF6\u5939",
  "settings.default-folder-desc": "\u7B14\u8BB0 frontmatter \u4E2D image-folder \u5C5E\u6027\u53EF\u8986\u76D6\u6B64\u8BBE\u7F6E\u3002",
  // --- Settings: processing ---
  "settings.auto-rename-paste": "\u7C98\u8D34\u56FE\u7247\u65F6\u81EA\u52A8\u91CD\u547D\u540D",
  "settings.auto-rename-drop": "\u62D6\u62FD\u56FE\u7247\u65F6\u81EA\u52A8\u91CD\u547D\u540D",
  // --- Settings: cleanup ---
  "settings.trash-folder": "\u56DE\u6536\u6587\u4EF6\u5939",
  "settings.trash-folder-desc": "\u672A\u5F15\u7528\u56FE\u7247\u79FB\u52A8\u5230\u7684\u6587\u4EF6\u5939\u3002",
  // --- Settings: language ---
  "settings.language": "\u754C\u9762\u8BED\u8A00",
  // --- Modal: unreferenced images ---
  "modal.unreferenced-title": "\u672A\u88AB\u5F15\u7528\u7684\u56FE\u7247",
  "modal.unreferenced-desc": "\u5171\u627E\u5230 {{n}} \u5F20\u672A\u88AB\u4EFB\u4F55\u7B14\u8BB0\u5F15\u7528\u7684\u56FE\u7247",
  "modal.select-all": "\u5168\u9009 / \u53D6\u6D88\u5168\u9009",
  "modal.move-to-trash": "\u79FB\u52A8\u5230\u56DE\u6536\u6587\u4EF6\u5939 ({{n}})",
  "modal.permanent-delete": "\u6C38\u4E45\u5220\u9664 ({{n}})"
};
var en = {
  // --- Commands ---
  "command.organize-current": "Organize images in current note",
  "command.organize-all": "Organize images in all notes",
  "command.find-unreferenced": "Find unreferenced images",
  // --- Notices ---
  "notice.organized": "Organized {{n}} image(s)",
  "notice.no-unreferenced": "No unreferenced images found",
  "notice.trashed": "Moved {{n}} image(s) to trash folder",
  "notice.deleted": "Permanently deleted {{n}} image(s)",
  "notice.please-select": "Please select images first",
  "notice.operation-failed": "Operation failed: {{msg}}",
  "notice.unknown-error": "Unknown error",
  // --- Settings sections ---
  "settings.section-naming": "Naming",
  "settings.section-variable-defaults": "Variable Defaults",
  "settings.section-variable-desc": "Default values used when a note lacks the corresponding frontmatter property.",
  "settings.section-storage": "Storage",
  "settings.section-processing": "Processing",
  "settings.section-cleanup": "Cleanup",
  "settings.section-language": "Language",
  // --- Settings: naming ---
  "settings.name-template": "Image name template",
  "settings.name-template-desc": "Supports {{date}}, {{time}}, {{datetime}}, {{random}}, {{counter}}, {{original}}, {{filename}} and custom frontmatter variables. Use colon for defaults: {{topic:general}}",
  "settings.date-format": "Date format",
  "settings.date-format-desc": "Used by {{date}}, e.g. YYYY-MM-DD",
  "settings.time-format": "Time format",
  "settings.time-format-desc": "Used by {{time}}, e.g. HHmmss",
  // --- Settings: variable defaults ---
  "settings.add-default": "Add default",
  "settings.var-name-placeholder": "Variable name",
  "settings.var-value-placeholder": "Default value",
  "settings.delete": "Delete",
  "settings.add": "Add",
  // --- Settings: storage ---
  "settings.default-folder": "Default image folder",
  "settings.default-folder-desc": "Can be overridden per note via the image-folder frontmatter property.",
  // --- Settings: processing ---
  "settings.auto-rename-paste": "Auto-rename on paste",
  "settings.auto-rename-drop": "Auto-rename on drag-drop",
  // --- Settings: cleanup ---
  "settings.trash-folder": "Trash folder",
  "settings.trash-folder-desc": "Folder where unreferenced images are moved.",
  // --- Settings: language ---
  "settings.language": "Interface language",
  // --- Modal: unreferenced images ---
  "modal.unreferenced-title": "Unreferenced Images",
  "modal.unreferenced-desc": "Found {{n}} image(s) not referenced by any note",
  "modal.select-all": "Select all / Deselect all",
  "modal.move-to-trash": "Move to trash ({{n}})",
  "modal.permanent-delete": "Permanently delete ({{n}})"
};
var locales = { zh, en };
var getLang = () => "en";
function setLanguageGetter(getter) {
  getLang = getter;
}
function t(key, params) {
  const lang = getLang();
  const map = locales[lang] ?? locales["zh"];
  let text = map[key];
  if (text === void 0) {
    text = locales["en"]?.[key] ?? key;
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{{${k}}}`, String(v));
    }
  }
  return text;
}

// src/settings/SettingTab.ts
var ImageRenamerSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app2, plugin) {
    super(app2, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Image Renamer" });
    containerEl.createEl("h3", { text: t("settings.section-language") });
    new import_obsidian.Setting(containerEl).setName(t("settings.language")).addDropdown(
      (dropdown) => dropdown.addOption("zh", "\u4E2D\u6587").addOption("en", "English").setValue(this.plugin.settings.language).onChange(async (value) => {
        this.plugin.settings.language = value;
        await this.plugin.saveSettings();
        this.display();
      })
    );
    containerEl.createEl("h3", { text: t("settings.section-naming") });
    new import_obsidian.Setting(containerEl).setName(t("settings.name-template")).setDesc(t("settings.name-template-desc")).addText(
      (text) => text.setPlaceholder("{{original}}").setValue(this.plugin.settings.nameTemplate).onChange(async (value) => {
        this.plugin.settings.nameTemplate = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName(t("settings.date-format")).setDesc(t("settings.date-format-desc")).addText(
      (text) => text.setPlaceholder("YYYY-MM-DD").setValue(this.plugin.settings.dateFormat).onChange(async (value) => {
        this.plugin.settings.dateFormat = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName(t("settings.time-format")).setDesc(t("settings.time-format-desc")).addText(
      (text) => text.setPlaceholder("HHmmss").setValue(this.plugin.settings.timeFormat).onChange(async (value) => {
        this.plugin.settings.timeFormat = value;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h4", { text: t("settings.section-variable-defaults") });
    containerEl.createEl("p", { text: t("settings.section-variable-desc") });
    const defaultsContainer = containerEl.createDiv();
    this.renderVariableDefaults(defaultsContainer);
    containerEl.createEl("h3", { text: t("settings.section-storage") });
    new import_obsidian.Setting(containerEl).setName(t("settings.default-folder")).setDesc(t("settings.default-folder-desc")).addText(
      (text) => text.setPlaceholder("attachments").setValue(this.plugin.settings.defaultFolder).onChange(async (value) => {
        this.plugin.settings.defaultFolder = value;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: t("settings.section-processing") });
    new import_obsidian.Setting(containerEl).setName(t("settings.auto-rename-paste")).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoRenamePaste).onChange(async (value) => {
        this.plugin.settings.autoRenamePaste = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName(t("settings.auto-rename-drop")).addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.autoRenameDrop).onChange(async (value) => {
        this.plugin.settings.autoRenameDrop = value;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: t("settings.section-cleanup") });
    new import_obsidian.Setting(containerEl).setName(t("settings.trash-folder")).setDesc(t("settings.trash-folder-desc")).addText(
      (text) => text.setPlaceholder(".trash-images").setValue(this.plugin.settings.trashFolder).onChange(async (value) => {
        this.plugin.settings.trashFolder = value;
        await this.plugin.saveSettings();
      })
    );
  }
  renderVariableDefaults(container) {
    container.empty();
    const entries = Object.entries(this.plugin.settings.variableDefaults);
    for (const [key, value] of entries) {
      const row = container.createDiv({ cls: "setting-item" });
      const info = row.createDiv({ cls: "setting-item-info" });
      info.createDiv({ cls: "setting-item-name", text: key });
      const control = row.createDiv({ cls: "setting-item-control" });
      const input = control.createEl("input", { type: "text" });
      input.value = value;
      input.placeholder = t("settings.var-value-placeholder");
      input.addEventListener("change", async () => {
        this.plugin.settings.variableDefaults[key] = input.value;
        await this.plugin.saveSettings();
      });
      const deleteBtn = control.createEl("button", { text: t("settings.delete") });
      deleteBtn.addEventListener("click", async () => {
        delete this.plugin.settings.variableDefaults[key];
        await this.plugin.saveSettings();
        this.renderVariableDefaults(container);
      });
    }
    const addRow = container.createDiv({ cls: "setting-item" });
    const addInfo = addRow.createDiv({ cls: "setting-item-info" });
    addInfo.createDiv({ cls: "setting-item-name", text: t("settings.add-default") });
    const addControl = addRow.createDiv({ cls: "setting-item-control" });
    const keyInput = addControl.createEl("input", {
      type: "text",
      placeholder: t("settings.var-name-placeholder")
    });
    const valInput = addControl.createEl("input", {
      type: "text",
      placeholder: t("settings.var-value-placeholder")
    });
    const addBtn = addControl.createEl("button", { text: t("settings.add") });
    addBtn.addEventListener("click", async () => {
      const key = keyInput.value.trim();
      if (!key)
        return;
      this.plugin.settings.variableDefaults[key] = valInput.value;
      await this.plugin.saveSettings();
      this.renderVariableDefaults(container);
    });
  }
};

// src/engine/VariableResolver.ts
var VariableResolver = class {
  constructor(getDateFormat, getTimeFormat) {
    this.getDateFormat = getDateFormat;
    this.getTimeFormat = getTimeFormat;
  }
  resolve(name, context, globalDefaults) {
    switch (name) {
      case "date":
        return formatDate(context.date, this.getDateFormat());
      case "time":
        return formatDate(context.date, this.getTimeFormat());
      case "datetime":
        return `${formatDate(context.date, this.getDateFormat())}-${formatDate(context.date, this.getTimeFormat())}`;
      case "random":
        return Math.random().toString(16).slice(2, 6);
      case "counter":
        return String(context.counter);
      case "original":
        return context.originalName !== "" ? context.originalName : formatDate(context.date, "YYYYMMDDHHmmss");
      case "filename":
        return context.activeFileName;
    }
    if (Object.prototype.hasOwnProperty.call(context.frontmatter, name)) {
      const val = context.frontmatter[name];
      return val == null ? "" : String(val);
    }
    if (Object.prototype.hasOwnProperty.call(globalDefaults, name)) {
      return globalDefaults[name];
    }
    return "";
  }
};
function formatDate(date, format) {
  const replacements = [
    [/YYYY|yyyy/g, String(date.getFullYear())],
    [/MM/g, String(date.getMonth() + 1).padStart(2, "0")],
    [/DD|dd/g, String(date.getDate()).padStart(2, "0")],
    [/HH|hh/g, String(date.getHours()).padStart(2, "0")],
    [/mm/g, String(date.getMinutes()).padStart(2, "0")],
    [/ss/g, String(date.getSeconds()).padStart(2, "0")]
  ];
  let result = format;
  for (const [regex, replacement] of replacements) {
    result = result.replace(regex, replacement);
  }
  return result;
}

// src/engine/TemplateEngine.ts
var TemplateEngine = class {
  constructor(variableResolver) {
    this.variableResolver = variableResolver;
  }
  render(template, context, globalDefaults) {
    return template.replace(
      /\{\{([a-zA-Z0-9_-]+)(?:\s*:\s*([^}]*?))?\s*\}\}/g,
      (_match, varName, inlineDefault) => {
        let value = this.variableResolver.resolve(
          varName,
          context,
          globalDefaults
        );
        if ((value === "" || value == null) && inlineDefault !== void 0) {
          value = inlineDefault;
        }
        return value;
      }
    );
  }
};

// src/counter/CounterManager.ts
var COUNTER_KEY = "image-counter";
var CounterManager = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  getCounter(file) {
    const metadata = this.plugin.app.metadataCache.getFileCache(file);
    const counter = metadata?.frontmatter?.[COUNTER_KEY];
    const num = Number(counter);
    return Number.isFinite(num) ? num : 0;
  }
  async incrementCounter(file) {
    await this.plugin.app.fileManager.processFrontMatter(file, (fm) => {
      const current = Number.isFinite(Number(fm[COUNTER_KEY])) ? Number(fm[COUNTER_KEY]) : 0;
      fm[COUNTER_KEY] = current + 1;
    });
  }
  async decrementCounter(file) {
    await this.plugin.app.fileManager.processFrontMatter(file, (fm) => {
      const current = Number.isFinite(Number(fm[COUNTER_KEY])) ? Number(fm[COUNTER_KEY]) : 1;
      fm[COUNTER_KEY] = Math.max(0, current - 1);
    });
  }
};

// src/handler/ImageCreateHandler.ts
var import_obsidian2 = require("obsidian");
var ImageCreateHandler = class {
  constructor(plugin, templateEngine, counterManager) {
    this.pendingRenames = /* @__PURE__ */ new Set();
    this.internalModify = false;
    this.pasteInProgress = false;
    this.plugin = plugin;
    this.templateEngine = templateEngine;
    this.counterManager = counterManager;
  }
  /** Intercept paste — save image with desired name, insert correct link */
  handlePaste(evt, editor, activeFile) {
    const clipboardData = evt.clipboardData;
    if (!clipboardData)
      return;
    for (let i = 0; i < clipboardData.items.length; i++) {
      const item = clipboardData.items[i];
      if (!item.type.startsWith("image/"))
        continue;
      const ext = item.type.split("/")[1] || "png";
      const settings = this.plugin.settings;
      if (!settings.imageFormats.includes(ext))
        continue;
      const blob = item.getAsFile();
      if (!blob)
        continue;
      evt.preventDefault();
      evt.stopPropagation();
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuf = reader.result;
        const newPath = this.buildNewPath(activeFile, ext);
        if (!newPath)
          return;
        const finalPath = this.resolveDuplicate(newPath);
        this.pendingRenames.add(finalPath);
        try {
          const folderPath = finalPath.substring(0, finalPath.lastIndexOf("/"));
          if (folderPath) {
            const folder = this.plugin.app.vault.getAbstractFileByPath(folderPath);
            if (!folder) {
              await this.plugin.app.vault.createFolder(folderPath);
            }
          }
          await this.plugin.app.vault.createBinary(finalPath, arrayBuf);
          editor.replaceSelection(`![[${finalPath}]]`);
          this.internalModify = true;
          await this.counterManager.incrementCounter(activeFile);
          this.internalModify = false;
        } catch (e) {
          console.error("[ImageRenamer] paste error:", e);
        } finally {
          this.pendingRenames.delete(finalPath);
        }
      };
      reader.readAsArrayBuffer(blob);
      return;
    }
  }
  /** Mark that a paste event is in progress — handleCreate should skip
   *  files created by paste (not drag-drop) when autoRenamePaste is OFF */
  markPasteInProgress() {
    this.pasteInProgress = true;
    setTimeout(() => {
      this.pasteInProgress = false;
    }, 500);
  }
  /** Handle image deletion — decrement the active note's counter */
  handleDelete(file) {
    const settings = this.plugin.settings;
    const ext = file.extension.toLowerCase();
    if (!settings.imageFormats.includes(ext))
      return;
    const activeFile = this.plugin.app.workspace.getActiveFile();
    if (!activeFile)
      return;
    this.counterManager.decrementCounter(activeFile);
  }
  /** Fallback: drag-drop via vault create event */
  async handleCreate(file) {
    const settings = this.plugin.settings;
    const ext = file.extension.toLowerCase();
    if (this.pasteInProgress)
      return;
    if (!settings.imageFormats.includes(ext))
      return;
    if (!settings.autoRenameDrop)
      return;
    const activeFile = this.plugin.app.workspace.getActiveFile();
    if (!activeFile)
      return;
    if (this.pendingRenames.has(file.path))
      return;
    this.pendingRenames.add(file.path);
    try {
      const current = this.plugin.app.vault.getAbstractFileByPath(file.path);
      if (!current || !("extension" in current))
        return;
      const newPath = this.buildNewPath(activeFile, ext);
      if (!newPath)
        return;
      const resolvedPath = this.resolveDuplicate(newPath);
      if (current.path === resolvedPath)
        return;
      const oldPath = file.path;
      const oldBasename = file.basename;
      await this.plugin.app.fileManager.renameFile(
        current,
        resolvedPath
      );
      this.internalModify = true;
      await this.counterManager.incrementCounter(activeFile);
      this.internalModify = false;
      this.fixStaleLinks(activeFile, oldPath, oldBasename, resolvedPath);
      this.watchForStaleLink(activeFile, oldPath, oldBasename, resolvedPath);
    } finally {
      this.pendingRenames.delete(file.path);
    }
  }
  buildNewPath(activeFile, ext) {
    const settings = this.plugin.settings;
    const metadata = this.plugin.app.metadataCache.getFileCache(activeFile);
    const frontmatter = metadata?.frontmatter ?? {};
    const counter = this.counterManager.getCounter(activeFile);
    const context = {
      date: /* @__PURE__ */ new Date(),
      frontmatter: { ...frontmatter },
      counter,
      originalName: "",
      activeFileName: activeFile.basename
    };
    const newBasename = this.templateEngine.render(
      settings.nameTemplate,
      context,
      settings.variableDefaults
    );
    const targetFolder = frontmatter["image-folder"] || settings.defaultFolder;
    return `${targetFolder}/${newBasename}.${ext}`;
  }
  watchForStaleLink(activeFile, oldPath, oldBasename, newLinkTarget) {
    let cleaned = false;
    const ref = this.plugin.app.vault.on("modify", async (modified) => {
      if (cleaned)
        return;
      if (this.internalModify)
        return;
      if (!(modified instanceof import_obsidian2.TFile))
        return;
      if (modified.path !== activeFile.path)
        return;
      cleaned = true;
      this.plugin.app.vault.offref(ref);
      await this.fixStaleLinks(
        activeFile,
        oldPath,
        oldBasename,
        newLinkTarget
      );
    });
    setTimeout(() => {
      if (!cleaned) {
        cleaned = true;
        this.plugin.app.vault.offref(ref);
      }
    }, 5e3);
  }
  async fixStaleLinks(activeFile, oldPath, oldBasename, newLinkTarget) {
    const content = await this.plugin.app.vault.read(activeFile);
    const oldNameExt = oldPath.split("/").pop();
    const patterns = [
      new RegExp(`(!?)\\[\\[${escapeRegex(oldPath)}\\]\\]`, "g"),
      new RegExp(`(!?)\\[\\[${escapeRegex(oldBasename)}\\]\\]`, "g"),
      new RegExp(`(!?)\\[\\[${escapeRegex(oldNameExt)}\\]\\]`, "g")
    ];
    let updated = content;
    for (const re of patterns) {
      updated = updated.replace(re, `$1[[${newLinkTarget}]]`);
    }
    if (updated !== content) {
      this.internalModify = true;
      await this.plugin.app.vault.modify(activeFile, updated);
      this.internalModify = false;
    }
  }
  resolveDuplicate(path) {
    const dot = path.lastIndexOf(".");
    const base = path.slice(0, dot);
    const ext = path.slice(dot + 1);
    let candidate = path;
    let n = 1;
    while (this.plugin.app.vault.getAbstractFileByPath(candidate)) {
      candidate = `${base}-${n}.${ext}`;
      n++;
    }
    return candidate;
  }
};
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// src/handler/BatchProcessor.ts
var COUNTER_KEY2 = "image-counter";
var BatchProcessor = class {
  constructor(plugin, templateEngine, counterManager) {
    this.plugin = plugin;
    this.templateEngine = templateEngine;
    this.counterManager = counterManager;
  }
  async organizeCurrentNote() {
    const activeFile = this.plugin.app.workspace.getActiveFile();
    if (!activeFile)
      return 0;
    return this.organizeNote(activeFile);
  }
  async organizeAllNotes() {
    const files = this.plugin.app.vault.getMarkdownFiles();
    let count = 0;
    for (const file of files) {
      count += await this.organizeNote(file);
    }
    return count;
  }
  async organizeNote(noteFile) {
    const settings = this.plugin.settings;
    const metadata = this.plugin.app.metadataCache.getFileCache(noteFile);
    const frontmatter = metadata?.frontmatter ?? {};
    const embeds = metadata?.embeds ?? [];
    const targetFolder = frontmatter["image-folder"] || settings.defaultFolder;
    let counter = this.counterManager.getCounter(noteFile);
    let processed = 0;
    for (const embed of embeds) {
      const linkedFile = this.plugin.app.metadataCache.getFirstLinkpathDest(
        embed.link,
        noteFile.path
      );
      if (!linkedFile)
        continue;
      const ext = linkedFile.extension.toLowerCase();
      if (!settings.imageFormats.includes(ext))
        continue;
      const context = {
        date: new Date(linkedFile.stat.ctime),
        frontmatter: { ...frontmatter },
        counter,
        originalName: linkedFile.basename,
        activeFileName: noteFile.basename
      };
      const newBasename = this.templateEngine.render(
        settings.nameTemplate,
        context,
        settings.variableDefaults
      );
      let newPath = `${targetFolder}/${newBasename}.${ext}`;
      newPath = this.resolveDuplicate(newPath, linkedFile);
      if (linkedFile.path !== newPath) {
        try {
          await this.plugin.app.fileManager.renameFile(linkedFile, newPath);
          processed++;
          counter++;
        } catch (e) {
          console.error(`Failed to rename ${linkedFile.path}:`, e);
        }
      }
    }
    if (processed > 0) {
      await this.plugin.app.fileManager.processFrontMatter(
        noteFile,
        (fm) => {
          fm[COUNTER_KEY2] = counter;
        }
      );
    }
    return processed;
  }
  resolveDuplicate(path, exclude) {
    const dot = path.lastIndexOf(".");
    const base = path.slice(0, dot);
    const ext = path.slice(dot + 1);
    let candidate = path;
    let n = 1;
    let existing = this.plugin.app.vault.getAbstractFileByPath(candidate);
    while (existing && !(exclude && existing.path === exclude.path)) {
      candidate = `${base}-${n}.${ext}`;
      n++;
      existing = this.plugin.app.vault.getAbstractFileByPath(candidate);
    }
    return candidate;
  }
};

// src/handler/UnreferencedFinder.ts
var UnreferencedFinder = class {
  constructor(plugin) {
    this.plugin = plugin;
  }
  async find() {
    const settings = this.plugin.settings;
    const folders = /* @__PURE__ */ new Set();
    folders.add(settings.defaultFolder);
    const allNotes = this.plugin.app.vault.getMarkdownFiles();
    for (const file of allNotes) {
      const metadata = this.plugin.app.metadataCache.getFileCache(file);
      const imageFolder = metadata?.frontmatter?.["image-folder"];
      if (typeof imageFolder === "string" && imageFolder.trim()) {
        folders.add(imageFolder.trim().replace(/^\/+|\/+$/g, ""));
      }
    }
    const images = [];
    const allFiles = this.plugin.app.vault.getFiles();
    for (const folderPath of folders) {
      if (!folderPath)
        continue;
      images.push(
        ...allFiles.filter(
          (f) => f.path.startsWith(folderPath + "/") && settings.imageFormats.includes(f.extension.toLowerCase())
        )
      );
    }
    const referencedPaths = /* @__PURE__ */ new Set();
    for (const note of allNotes) {
      const metadata = this.plugin.app.metadataCache.getFileCache(note);
      const embeds = metadata?.embeds ?? [];
      for (const embed of embeds) {
        const linked = this.plugin.app.metadataCache.getFirstLinkpathDest(
          embed.link,
          note.path
        );
        if (linked) {
          referencedPaths.add(linked.path);
        }
      }
    }
    return images.filter((img) => !referencedPaths.has(img.path)).map((img) => ({ file: img, path: img.path, name: img.name }));
  }
  async moveToTrash(images) {
    const trashFolder = this.plugin.settings.trashFolder;
    for (const img of images) {
      let newPath = `${trashFolder}/${img.name}`;
      let n = 1;
      while (this.plugin.app.vault.getAbstractFileByPath(newPath)) {
        const dot = img.name.lastIndexOf(".");
        const base = img.name.slice(0, dot);
        const ext = img.name.slice(dot + 1);
        newPath = `${trashFolder}/${base}-${n}.${ext}`;
        n++;
      }
      await this.plugin.app.fileManager.renameFile(img.file, newPath);
    }
  }
  async deleteImages(images) {
    for (const img of images) {
      await this.plugin.app.vault.delete(img.file);
    }
  }
};

// src/handler/UnreferencedImagesModal.ts
var import_obsidian3 = require("obsidian");
var UnreferencedImagesModal = class extends import_obsidian3.Modal {
  constructor(images, onTrash, onDelete) {
    super(app);
    this.selected = /* @__PURE__ */ new Set();
    this.images = images;
    this.onTrash = onTrash;
    this.onDelete = onDelete;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h2", { text: t("modal.unreferenced-title") });
    contentEl.createEl("p", {
      text: t("modal.unreferenced-desc", { n: this.images.length })
    });
    const list = contentEl.createDiv();
    const checkboxes = [];
    const selectAllRow = list.createDiv({ cls: "unreferenced-image-row" });
    selectAllRow.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid var(--divider-color);margin-bottom:4px;";
    const selectAllCheckbox = selectAllRow.createEl("input", {
      type: "checkbox"
    });
    selectAllRow.createEl("span", {
      text: t("modal.select-all"),
      cls: "unreferenced-select-all-label"
    });
    selectAllRow.querySelector("span").style.cssText = "font-weight:600;";
    selectAllCheckbox.addEventListener("change", () => {
      const checked = selectAllCheckbox.checked;
      for (const cb of checkboxes) {
        cb.checked = checked;
      }
      if (checked) {
        for (const img of this.images)
          this.selected.add(img.path);
      } else {
        this.selected.clear();
      }
      updateCounts();
    });
    for (const img of this.images) {
      const row = list.createDiv({ cls: "unreferenced-image-row" });
      row.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 0;";
      const checkbox = row.createEl("input", { type: "checkbox" });
      checkboxes.push(checkbox);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          this.selected.add(img.path);
        } else {
          this.selected.delete(img.path);
        }
        if (this.selected.size === 0) {
          selectAllCheckbox.checked = false;
          selectAllCheckbox.indeterminate = false;
        } else if (this.selected.size === this.images.length) {
          selectAllCheckbox.checked = true;
          selectAllCheckbox.indeterminate = false;
        } else {
          selectAllCheckbox.checked = false;
          selectAllCheckbox.indeterminate = true;
        }
        updateCounts();
      });
      row.createEl("span", { text: img.path });
    }
    const buttons = contentEl.createDiv();
    buttons.style.cssText = "display:flex;gap:8px;margin-top:16px;justify-content:flex-end;";
    const trashBtn = buttons.createEl("button", {
      text: t("modal.move-to-trash", { n: 0 })
    });
    trashBtn.addEventListener("click", async () => {
      const selected = this.images.filter(
        (i) => this.selected.has(i.path)
      );
      if (selected.length === 0) {
        new import_obsidian3.Notice(t("notice.please-select"));
        return;
      }
      try {
        await this.onTrash(selected);
        new import_obsidian3.Notice(t("notice.trashed", { n: selected.length }));
        this.close();
      } catch (e) {
        const msg = e instanceof Error ? e.message : t("notice.unknown-error");
        new import_obsidian3.Notice(t("notice.operation-failed", { msg }));
      }
    });
    const deleteBtn = buttons.createEl("button", {
      text: t("modal.permanent-delete", { n: 0 })
    });
    deleteBtn.style.cssText = "background-color:#e93147;";
    deleteBtn.addEventListener("click", async () => {
      const selected = this.images.filter(
        (i) => this.selected.has(i.path)
      );
      if (selected.length === 0) {
        new import_obsidian3.Notice(t("notice.please-select"));
        return;
      }
      try {
        await this.onDelete(selected);
        new import_obsidian3.Notice(t("notice.deleted", { n: selected.length }));
        this.close();
      } catch (e) {
        const msg = e instanceof Error ? e.message : t("notice.unknown-error");
        new import_obsidian3.Notice(t("notice.operation-failed", { msg }));
      }
    });
    const updateCounts = () => {
      trashBtn.textContent = t("modal.move-to-trash", { n: this.selected.size });
      deleteBtn.textContent = t("modal.permanent-delete", { n: this.selected.size });
    };
    list.addEventListener("change", updateCounts);
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};

// src/main.ts
var ImageRenamerPlugin = class extends import_obsidian4.Plugin {
  async onload() {
    await this.loadSettings();
    setLanguageGetter(() => this.settings.language);
    this.variableResolver = new VariableResolver(
      () => this.settings.dateFormat,
      () => this.settings.timeFormat
    );
    this.templateEngine = new TemplateEngine(this.variableResolver);
    this.counterManager = new CounterManager(this);
    this.imageCreateHandler = new ImageCreateHandler(
      this,
      this.templateEngine,
      this.counterManager
    );
    this.batchProcessor = new BatchProcessor(
      this,
      this.templateEngine,
      this.counterManager
    );
    this.unreferencedFinder = new UnreferencedFinder(this);
    this.registerEvent(
      this.app.workspace.on("editor-paste", (evt, editor, view) => {
        if (!this.settings.autoRenamePaste) {
          const clipboardData = evt.clipboardData;
          if (clipboardData) {
            for (let i = 0; i < clipboardData.items.length; i++) {
              if (clipboardData.items[i].type.startsWith("image/")) {
                this.imageCreateHandler.markPasteInProgress();
                break;
              }
            }
          }
          return;
        }
        const activeFile = view.file;
        if (!activeFile)
          return;
        this.imageCreateHandler.handlePaste(evt, editor, activeFile);
      })
    );
    this.registerEvent(
      this.app.vault.on("create", (file) => {
        if (file instanceof import_obsidian4.TFile) {
          this.imageCreateHandler.handleCreate(file);
        }
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        if (file instanceof import_obsidian4.TFile) {
          this.imageCreateHandler.handleDelete(file);
        }
      })
    );
    this.addCommand({
      id: "organize-current-note-images",
      name: t("command.organize-current"),
      callback: async () => {
        const count = await this.batchProcessor.organizeCurrentNote();
        new import_obsidian4.Notice(t("notice.organized", { n: count }));
      }
    });
    this.addCommand({
      id: "organize-all-notes-images",
      name: t("command.organize-all"),
      callback: async () => {
        const count = await this.batchProcessor.organizeAllNotes();
        new import_obsidian4.Notice(t("notice.organized", { n: count }));
      }
    });
    this.addCommand({
      id: "find-unreferenced-images",
      name: t("command.find-unreferenced"),
      callback: async () => {
        const results = await this.unreferencedFinder.find();
        if (results.length === 0) {
          new import_obsidian4.Notice(t("notice.no-unreferenced"));
          return;
        }
        new UnreferencedImagesModal(
          results,
          async (selected) => {
            await this.unreferencedFinder.moveToTrash(selected);
          },
          async (selected) => {
            await this.unreferencedFinder.deleteImages(selected);
          }
        ).open();
      }
    });
    this.addSettingTab(
      new ImageRenamerSettingTab(this.app, this)
    );
  }
  onunload() {
  }
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
};

/* nosourcemap */
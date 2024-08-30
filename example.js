"use strict";
/* MD
### 🏢 Loading IFC files
---

IFC is the most common format to share BIM data openly. Our libraries are able to load, navigate and even create and edit them directly. In this tutorial, you'll learn how to open an IFC model in the 3D scene.

:::tip IFC?

If you are not famliar with the construction industry, this might be the first time you come across this term. It stands for Industry Foundation Classes, and it's the most widespread standard for sharing BIM data freely, without depending on specific software manufacturers and their propietary formats.

:::

In this tutorial, we will import:

- `web-ifc` to get some IFC items.
- `@thatopen/ui` to add some simple and cool UI menus.
- `@thatopen/components` to set up the barebone of our app.
- `Stats.js` (optional) to measure the performance of our app.
*/
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var WEBIFC = require("web-ifc");
var BUI = require("@thatopen/ui");
var stats_js_1 = require("stats.js");
var OBC = require("@thatopen/components");
/* MD
  ### 🌎 Setting up a simple scene
  ---

  We will start by creating a simple scene with a camera and a renderer. If you don't know how to set up a scene, you can check the Worlds tutorial.
*/
var container = document.getElementById("container");
var components = new OBC.Components();
var worlds = components.get(OBC.Worlds);
var world = worlds.create();
world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);
components.init();
world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);
world.scene.setup();
var grids = components.get(OBC.Grids);
grids.create(world);
/* MD

  We'll make the background of the scene transparent so that it looks good in our docs page, but you don't have to do that in your app!

*/
world.scene.three.background = null;
/* MD
  ### 🚗🏎️ Getting IFC and fragments
  ---
  When we read an IFC file, we convert it to a geometry called Fragments. Fragments are a lightweight representation of geometry built on top of THREE.js `InstancedMesh` to make it easy to work with BIM data efficiently. All the BIM geometry you see in our libraries are Fragments, and they are great: they are lightweight, they are fast and we have tons of tools to work with them. But fragments are not used outside our libraries. So how can we convert an IFC file to fragments? Let's check out how:
  */
var fragments = components.get(OBC.FragmentsManager);
var fragmentIfcLoader = components.get(OBC.IfcLoader);
/* MD
  :::info Why not just IFC?

  IFC is nice because it lets us exchange data with many tools in the AECO industry. But your graphics card doesn't understand IFC. It only understands one thing: triangles. So we must convert IFC to triangles. There are many ways to do it, some more efficient than others. And that's exactly what Fragments are: a very efficient way to display the triangles coming from IFC files.

  :::

  Once Fragments have been generated, you can export them and then load them back directly, without needing the original IFC file. Why would you do that? Well, because fragments can load +10 times faster than IFC. And the reason is very simple.   When reading an IFC, we must parse the file, read the implicit geometry, convert it to triangles (Fragments) and send it to the GPU. When reading fragments, we just take the triangles and send them, so it's super fast.

  :::danger How to use Fragments?

  If you want to find out more about Fragments, check out the Fragments Manager tutorial.

  :::


  ### 🔭🔧 Calibrating the converter
  ---
  Now, we need to configure the path of the WASM files. What's WASM? It's a technology that lets us run C++ on the browser, which means that we can load IFCs super fast! These files are the compilation of our `web-ifc` library. You can find them in the github repo and in NPM. These files need to be available to our app, so you have 2 options:

  - Download them and serve them statically.
  - Get them from a remote server.

  The easiest way is getting them from unpkg, and the cool thing is that you don't need to do it manually! It can be done directly by the tool just by writing the following:
  */
await fragmentIfcLoader.setup();
// If you want to the path to unpkg manually, then you can skip the line
// above and set them manually as below:
// fragmentIfcLoader.settings.wasm = {
//   path: "https://unpkg.com/web-ifc@0.0.57/",
//   absolute: true,
// };
/* MD
  Awesome! Optionally, we can exclude categories that we don't want to convert to fragments like very easily:
*/
var excludedCats = [
    WEBIFC.IFCTENDONANCHOR,
    WEBIFC.IFCREINFORCINGBAR,
    WEBIFC.IFCREINFORCINGELEMENT,
];
for (var _i = 0, excludedCats_1 = excludedCats; _i < excludedCats_1.length; _i++) {
    var cat = excludedCats_1[_i];
    fragmentIfcLoader.settings.excludedCategories.add(cat);
}
/* MD
  We can further configure the conversion using the `webIfc` object. In this example, we will make the IFC model go to the origin of the scene (don't worry, this supports model federation):
  */
fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
/* MD
  ### 🚗🔥 Loading the IFC
  ---
  Next, let's define a function to load the IFC programmatically. We have hardcoded the path to one of our IFC files, but feel free to do this with any of your own files!

 :::info Opening local IFCs

  Keep in mind that the browser can't access the file of your computer directly, so you will need to use the Open File API to open local files.

  :::
*/
function loadIfc() {
    return __awaiter(this, void 0, void 0, function () {
        var file, data, buffer, model;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://thatopen.github.io/engine_components/resources/small.ifc")];
                case 1:
                    file = _a.sent();
                    return [4 /*yield*/, file.arrayBuffer()];
                case 2:
                    data = _a.sent();
                    buffer = new Uint8Array(data);
                    return [4 /*yield*/, fragmentIfcLoader.load(buffer)];
                case 3:
                    model = _a.sent();
                    model.name = "example";
                    world.scene.three.add(model);
                    return [2 /*return*/];
            }
        });
    });
}
/* MD
  If you want to get the resulted model every time a new model is loaded, you can subscribe to the following event anywhere in your app:
*/
fragments.onFragmentsLoaded.add(function (model) {
    console.log(model);
});
/* MD
  ### 🎁 Exporting the result to fragments
  ---
  Once you have your precious fragments, you might want to save them so that you don't need to open this IFC file each time your user gets into your app. Instead, the next time you can load the fragments directly. Defining a function to export fragments is as easy as this:
*/
function download(file) {
    var link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
}
function exportFragments() {
    return __awaiter(this, void 0, void 0, function () {
        var group, data, properties;
        return __generator(this, function (_a) {
            if (!fragments.groups.size) {
                return [2 /*return*/];
            }
            group = Array.from(fragments.groups.values())[0];
            data = fragments.export(group);
            download(new File([new Blob([data])], "small.frag"));
            properties = group.getLocalProperties();
            if (properties) {
                download(new File([JSON.stringify(properties)], "small.json"));
            }
            return [2 /*return*/];
        });
    });
}
/* MD
  ### 🧠🧼 Cleaning memory
  ---
  Now, just like in the `FragmentManager` tutorial, you will need to dispose the memory if your user wants to reset the state of the scene, especially if you are using Single Page Application technologies like React, Angular, Vue, etc. To do that, you can simply call the `dispose` method:
*/
function disposeFragments() {
    fragments.dispose();
}
/* MD
  That's it! Congrats, now you can load IFC files into your app, generate the 3D geometry and property data for them and navigate them in 3D. In other tutorials, you'll find tons of tools to work with them and create amazing BIM apps! See you there. 💪

  ### ⏱️ Measuring the performance (optional)
  ---

  We'll use the [Stats.js](https://github.com/mrdoob/stats.js) to measure the performance of our app. We will add it to the top left corner of the viewport. This way, we'll make sure that the memory consumption and the FPS of our app are under control.
*/
var stats = new stats_js_1.default();
stats.showPanel(2);
document.body.append(stats.dom);
stats.dom.style.left = "0px";
stats.dom.style.zIndex = "unset";
world.renderer.onBeforeUpdate.add(function () { return stats.begin(); });
world.renderer.onAfterUpdate.add(function () { return stats.end(); });
/* MD
  ### 🧩 Adding some UI
  ---

  We will use the `@thatopen/ui` library to add some simple and cool UI elements to our app. First, we need to call the `init` method of the `BUI.Manager` class to initialize the library:
*/
BUI.Manager.init();
/* MD
Now we will add some UI to explode and restore our BIM model, which can be easily done with a checkbox that determines whether a model is exploded or not. For more information about the UI library, you can check the specific documentation for it!
*/
var panel = BUI.Component.create(function () {
    return BUI.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  <bim-panel active label=\"IFC Loader Tutorial\" class=\"options-menu\">\n    <bim-panel-section collapsed label=\"Controls\">\n      <bim-panel-section style=\"padding-top: 12px;\">\n      \n        <bim-button label=\"Load IFC\"\n          @click=\"", "\">\n        </bim-button>  \n            \n        <bim-button label=\"Export fragments\"\n          @click=\"", "\">\n        </bim-button>  \n            \n        <bim-button label=\"Dispose fragments\"\n          @click=\"", "\">\n        </bim-button>\n      \n      </bim-panel-section>\n      \n    </bim-panel>\n  "], ["\n  <bim-panel active label=\"IFC Loader Tutorial\" class=\"options-menu\">\n    <bim-panel-section collapsed label=\"Controls\">\n      <bim-panel-section style=\"padding-top: 12px;\">\n      \n        <bim-button label=\"Load IFC\"\n          @click=\"", "\">\n        </bim-button>  \n            \n        <bim-button label=\"Export fragments\"\n          @click=\"", "\">\n        </bim-button>  \n            \n        <bim-button label=\"Dispose fragments\"\n          @click=\"", "\">\n        </bim-button>\n      \n      </bim-panel-section>\n      \n    </bim-panel>\n  "])), function () {
        loadIfc();
    }, function () {
        exportFragments();
    }, function () {
        disposeFragments();
    });
});
document.body.append(panel);
/* MD
  And we will make some logic that adds a button to the screen when the user is visiting our app from their phone, allowing to show or hide the menu. Otherwise, the menu would make the app unusable.
*/
var button = BUI.Component.create(function () {
    return BUI.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      <bim-button class=\"phone-menu-toggler\" icon=\"solar:settings-bold\"\n        @click=\"", "\">\n      </bim-button>\n    "], ["\n      <bim-button class=\"phone-menu-toggler\" icon=\"solar:settings-bold\"\n        @click=\"", "\">\n      </bim-button>\n    "])), function () {
        if (panel.classList.contains("options-menu-visible")) {
            panel.classList.remove("options-menu-visible");
        }
        else {
            panel.classList.add("options-menu-visible");
        }
    });
});
document.body.append(button);
var templateObject_1, templateObject_2;
/* MD
  ### 🎉 Wrap up
  ---

  That's it! You have created an app that can load IFC files, convert them to 3D fragments and navigate them in 3D. Fantastic job! For bigger IFC files, instead of reading them directly every time, you can store the fragments and properties and load them instead of the original IFC. For even bigger files, you can use streaming, which we also cover in other tutorials!
*/ 

// // export default defineContentScript({
// //   matches: ['*://*.google.com/*'],
// //   main() {
// //
// //   },
// // });
//
// import "./src/style.css"
// import ReactDOM from "react-dom/client";
// import {App} from "./src/features/index.tsx"
//
// export default defineContentScript({
//   matches: ["*://*.linkedin.com/*"],
//   cssInjectionMode: "ui",
//
//   async main(ctx) {
//     const ui = await createShadowRootUi(ctx, {
//       name: "wxt-react-example",
//       position: "inline",
//       anchor: "body",
//       append: "first",
//       onMount: (container) => {
//         // Don't mount react app directly on <body>
//         const wrapper = document.createElement("div");
//         container.append(wrapper);
//
//         const root = ReactDOM.createRoot(wrapper);
//         root.render(<App/>);
//         return { root, wrapper };
//       },
//       onRemove: (elements) => {
//         elements?.root.unmount();
//         elements?.wrapper.remove();
//       },
//     });
//
//     ui.mount();
//   },
// });
// import "./src/style.css";
// import ReactDOM from "react-dom/client";
// import { App } from "./src/features/index.tsx";
//
// export default defineContentScript({
//   matches: ["*://*.linkedin.com/*"],
//   cssInjectionMode: "ui",
//
//   async main(ctx) {
//     const ui = await createShadowRootUi(ctx, {
//       name: "wxt-react-example",
//       position: "overlay", // Use fixed positioning for overlay-like behavior
//       anchor: ".msg-form__placeholder",  // More specific element, e.g., LinkedIn messaging footer
//       append: "last",  // Append at the end of this element
//       onMount: (container) => {
//         const wrapper = document.createElement("div");
//         wrapper.classList.add("my-overlay-wrapper");  // Class for styling
//         container.append(wrapper);
//
//         const root = ReactDOM.createRoot(wrapper);
//         root.render(<App />);
//         return { root, wrapper };
//       },
//       onRemove: (elements) => {
//         elements?.root.unmount();
//         elements?.wrapper.remove();
//       },
//     });
//
//     ui.mount();
//   },
// });

import "./src/style.css";
import ReactDOM from "react-dom/client";
import { App } from "./src/features/index.tsx";

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    // Helper function to wait for an element to be available
    const waitForElement = (selector: string, timeout = 5000): Promise<Element | null> => {
      return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const checkElement = () => {
          const element = document.querySelector(selector);
          if (element) {
            resolve(element);
          } else if (Date.now() - startTime > timeout) {
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
          } else {
            requestAnimationFrame(checkElement); // Try again on next frame
          }
        };

        checkElement(); // Start checking
      });
    };

    try {
      const targetElement = await waitForElement(".msg-form__footer", 5000); // Wait for the LinkedIn messaging footer

      if (targetElement) {
        const ui = await createShadowRootUi(ctx, {
          name: "wxt-react-example",
          position: "overlay", // Use fixed positioning for overlay-like behavior
          anchor: targetElement,  // More specific element, e.g., LinkedIn messaging footer
          append: "last",  // Append at the end of this element
          onMount: (container) => {
            const wrapper = document.createElement("div");
            wrapper.classList.add("my-overlay-wrapper");  // Class for styling
            container.append(wrapper);

            const root = ReactDOM.createRoot(wrapper);
            root.render(<App />);
            return { root, wrapper };
          },
          onRemove: (elements) => {
            elements?.root.unmount();
            elements?.wrapper.remove();
          },
        });

        ui.mount();
      } else {
        throw new Error("Target element not found");
      }
    } catch (error) {
      console.error("Error while injecting UI:", error);
      // Optionally fall back to appending to the body
      const ui = await createShadowRootUi(ctx, {
        name: "wxt-react-example",
        position: "overlay", // Use fixed positioning for overlay-like behavior
        anchor: "body",  // Fallback to body
        append: "first",  // Append at the start of the body
        onMount: (container) => {
          const wrapper = document.createElement("div");
          wrapper.classList.add("my-overlay-wrapper");  // Class for styling
          container.append(wrapper);

          const root = ReactDOM.createRoot(wrapper);
          root.render(<App />);
          return { root, wrapper };
        },
        onRemove: (elements) => {
          elements?.root.unmount();
          elements?.wrapper.remove();
        },
      });

      ui.mount();
    }
  },
});

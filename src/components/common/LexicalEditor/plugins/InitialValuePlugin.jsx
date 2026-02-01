// import React, { useEffect } from "react";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";

// const InitialValuePlugin = ({ value }) => {
//   const [editor] = useLexicalComposerContext();
//   const [isFirstRender, setIsFirstRender] = React.useState(true);

//   useEffect(() => {
//     if (isFirstRender && value) {
//       editor.update(() => {
//         const root = $getRoot();
//         if (root.getFirstChild() === null) {
//           try {
//             if (typeof value === "string") {
//               try {
//                 const parsed = JSON.parse(value);
//                 const editorState = editor.parseEditorState(parsed);
//                 editor.setEditorState(editorState);
//               } catch (e) {
//                 root.clear();
//                 const paragraph = $createParagraphNode();
//                 const textNode = $createTextNode(value);
//                 paragraph.append(textNode);
//                 root.append(paragraph);
//               }
//             } else if (typeof value === "object") {
//               const editorState = editor.parseEditorState(value);
//               editor.setEditorState(editorState);
//             }
//           } catch (err) {
//             console.error("Failed to load initial Lexical value:", err);
//           }
//         }
//       });
//       setIsFirstRender(false);
//     }
//   }, [editor, value, isFirstRender]);

//   return null;
// };

// export default InitialValuePlugin;

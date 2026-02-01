// "use client";

// import React from "react";
// import { LexicalComposer } from "@lexical/react/LexicalComposer";
// import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
// import { ContentEditable } from "@lexical/react/LexicalContentEditable";
// import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
// import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
// import { ListPlugin } from "@lexical/react/LexicalListPlugin";
// import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
// import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
// import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
// import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
// import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
// import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
// import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

// import theme from "./EditorTheme";
// import EditorNodes from "./EditorNodes";
// import { cn } from "./utils";
// import ToolbarPlugin from "./plugins/ToolbarPlugin";
// import InitialValuePlugin from "./plugins/InitialValuePlugin";

// const LexicalEditor = ({
//   value,
//   onChange,
//   placeholder = "Start typing...",
//   error = false,
//   helperText = "",
//   className = "",
//   dir = "ltr",
// }) => {
//   const initialConfig = {
//     namespace: "GuestnaEditor",
//     theme,
//     onError: (error) => {
//       console.error("Lexical Error:", error);
//     },
//     nodes: EditorNodes,
//   };

//   const handleOnChange = (editorState) => {
//     editorState.read(() => {
//       const json = editorState.toJSON();
//       if (onChange) {
//         onChange(JSON.stringify(json));
//       }
//     });
//   };

//   return (
//     <div className={cn("w-full flex flex-col", className)} dir={dir}>
//       <LexicalComposer initialConfig={initialConfig}>
//         <div
//           className={cn(
//             "flex flex-col border rounded-lg transition-all focus-within:ring-1 focus-within:ring-mainColor focus-within:border-mainColor shadow-sm",
//             error ? "border-red-500" : "border-gray-200",
//             "bg-white"
//           )}
//         >
//           <ToolbarPlugin />
//           <div className="relative">
//             <RichTextPlugin
//               contentEditable={
//                 <ContentEditable className="min-h-[150px] outline-none p-4 text-gray-800 font-sans" />
//               }
//               placeholder={
//                 <div className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none font-sans">
//                   {placeholder}
//                 </div>
//               }
//               ErrorBoundary={LexicalErrorBoundary}
//             />
//             <HistoryPlugin />
//             <OnChangePlugin onChange={handleOnChange} />
//             <InitialValuePlugin value={value} />
//             <ListPlugin />
//             <LinkPlugin />
//             <TabIndentationPlugin />
//             <MarkdownShortcutPlugin />
//             <HorizontalRulePlugin />
//             <CheckListPlugin />
//             <TablePlugin />
//           </div>
//         </div>
//       </LexicalComposer>
//       {helperText && (
//         <p
//           className={cn(
//             "mt-1 text-xs transition-colors",
//             error ? "text-red-500" : "text-gray-500"
//           )}
//         >
//           {helperText}
//         </p>
//       )}

//       {/* Required for material icons in toolbar */}
//       <link
//         href="https://fonts.googleapis.com/icon?family=Material+Icons"
//         rel="stylesheet"
//       />
//     </div>
//   );
// };

// export default LexicalEditor;

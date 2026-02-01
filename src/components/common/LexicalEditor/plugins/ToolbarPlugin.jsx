// import React, { useEffect, useCallback, useState } from "react";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import {
//   $getSelection,
//   $isRangeSelection,
//   FORMAT_TEXT_COMMAND,
//   FORMAT_ELEMENT_COMMAND,
//   UNDO_COMMAND,
//   REDO_COMMAND,
//   CAN_UNDO_COMMAND,
//   CAN_REDO_COMMAND,
//   SELECTION_CHANGE_COMMAND,
// } from "lexical";
// import { $setBlocksType } from "@lexical/selection";
// import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
// import {
//   INSERT_UNORDERED_LIST_COMMAND,
//   INSERT_ORDERED_LIST_COMMAND,
// } from "@lexical/list";
// import { TOGGLE_LINK_COMMAND } from "@lexical/link";
// import { mergeRegister } from "@lexical/utils";
// import { cn } from "../utils";

// const Divider = () => <div className="w-[1px] bg-gray-200 mx-1 self-stretch" />;

// const LowPriority = 1;

// const ToolbarPlugin = () => {
//   const [editor] = useLexicalComposerContext();
//   const [canUndo, setCanUndo] = useState(false);
//   const [canRedo, setCanRedo] = useState(false);
//   const [isBold, setIsBold] = useState(false);
//   const [isItalic, setIsItalic] = useState(false);
//   const [isUnderline, setIsUnderline] = useState(false);
//   const [isStrikethrough, setIsStrikethrough] = useState(false);
//   const [isLink, setIsLink] = useState(false);

//   const updateToolbar = useCallback(() => {
//     const selection = $getSelection();
//     if ($isRangeSelection(selection)) {
//       setIsBold(selection.hasFormat("bold"));
//       setIsItalic(selection.hasFormat("italic"));
//       setIsUnderline(selection.hasFormat("underline"));
//       setIsStrikethrough(selection.hasFormat("strikethrough"));

//       const node = selection.getNodes()[0];
//       const parent = node?.getParent();
//       setIsLink(parent?.getType() === "link" || node?.getType() === "link");
//     }
//   }, []);

//   useEffect(() => {
//     return mergeRegister(
//       editor.registerUpdateListener(({ editorState }) => {
//         editorState.read(() => {
//           updateToolbar();
//         });
//       }),
//       editor.registerCommand(
//         CAN_UNDO_COMMAND,
//         (payload) => {
//           setCanUndo(payload);
//           return false;
//         },
//         LowPriority
//       ),
//       editor.registerCommand(
//         CAN_REDO_COMMAND,
//         (payload) => {
//           setCanRedo(payload);
//           return false;
//         },
//         LowPriority
//       ),
//       editor.registerCommand(
//         SELECTION_CHANGE_COMMAND,
//         () => {
//           updateToolbar();
//           return false;
//         },
//         LowPriority
//       )
//     );
//   }, [editor, updateToolbar]);

//   const insertLink = useCallback(() => {
//     if (!isLink) {
//       const url = prompt("Enter URL");
//       if (url) {
//         editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
//       }
//     } else {
//       editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
//     }
//   }, [editor, isLink]);

//   const formatHeading = (level) => {
//     editor.update(() => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         $setBlocksType(selection, () => $createHeadingNode(level));
//       }
//     });
//   };

//   const formatQuote = () => {
//     editor.update(() => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         $setBlocksType(selection, () => $createQuoteNode());
//       }
//     });
//   };

//   return (
//     <div className="flex flex-wrap items-center gap-1 p-1 bg-gray-50 border-b border-gray-200 sticky top-0 z-10 rounded-t-lg">
//       <button
//         type="button"
//         disabled={!canUndo}
//         onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
//         className="p-2 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors"
//         title="Undo (Ctrl+Z)"
//       >
//         <span className="material-icons text-sm">undo</span>
//       </button>
//       <button
//         type="button"
//         disabled={!canRedo}
//         onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
//         className="p-2 hover:bg-gray-200 rounded disabled:opacity-30 transition-colors"
//         title="Redo (Ctrl+Y)"
//       >
//         <span className="material-icons text-sm">redo</span>
//       </button>

//       <Divider />

//       <button
//         type="button"
//         onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
//         className={cn(
//           "p-2 hover:bg-gray-200 rounded transition-colors",
//           isBold && "bg-gray-200 font-bold text-mainColor"
//         )}
//         title="Bold (Ctrl+B)"
//       >
//         <span className="font-bold">B</span>
//       </button>
//       <button
//         type="button"
//         onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
//         className={cn(
//           "p-2 hover:bg-gray-200 rounded transition-colors",
//           isItalic && "bg-gray-200 italic text-mainColor"
//         )}
//         title="Italic (Ctrl+I)"
//       >
//         <span className="italic">I</span>
//       </button>
//       <button
//         type="button"
//         onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
//         className={cn(
//           "p-2 hover:bg-gray-200 rounded transition-colors",
//           isUnderline && "bg-gray-200 underline text-mainColor"
//         )}
//         title="Underline (Ctrl+U)"
//       >
//         <span className="underline">U</span>
//       </button>
//       <button
//         type="button"
//         onClick={() =>
//           editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
//         }
//         className={cn(
//           "p-2 hover:bg-gray-200 rounded transition-colors",
//           isStrikethrough && "bg-gray-200 line-through text-mainColor"
//         )}
//         title="Strikethrough"
//       >
//         <span className="line-through">S</span>
//       </button>

//       <Divider />

//       <button
//         type="button"
//         onClick={insertLink}
//         className={cn(
//           "p-2 hover:bg-gray-200 rounded transition-colors",
//           isLink && "bg-gray-200 text-mainColor"
//         )}
//         title="Insert Link"
//       >
//         <span className="material-icons text-sm">link</span>
//       </button>

//       <Divider />

//       <button
//         type="button"
//         onClick={() => formatHeading("h1")}
//         className="p-2 hover:bg-gray-200 rounded transition-colors font-bold text-xs"
//         title="Heading 1"
//       >
//         H1
//       </button>
//       <button
//         type="button"
//         onClick={() => formatHeading("h2")}
//         className="p-2 hover:bg-gray-200 rounded transition-colors font-bold text-xs"
//         title="Heading 2"
//       >
//         H2
//       </button>
//       <button
//         type="button"
//         onClick={() =>
//           editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
//         }
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Bullet List"
//       >
//         <span className="material-icons text-sm">format_list_bulleted</span>
//       </button>
//       <button
//         type="button"
//         onClick={() =>
//           editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
//         }
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Numbered List"
//       >
//         <span className="material-icons text-sm">format_list_numbered</span>
//       </button>
//       <button
//         type="button"
//         onClick={formatQuote}
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Quote"
//       >
//         <span className="material-icons text-sm">format_quote</span>
//       </button>

//       <Divider />

//       <button
//         type="button"
//         onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Align Left"
//       >
//         <span className="material-icons text-sm">format_align_left</span>
//       </button>
//       <button
//         type="button"
//         onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Align Center"
//       >
//         <span className="material-icons text-sm">format_align_center</span>
//       </button>
//       <button
//         type="button"
//         onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
//         className="p-2 hover:bg-gray-200 rounded transition-colors"
//         title="Align Right"
//       >
//         <span className="material-icons text-sm">format_align_right</span>
//       </button>
//     </div>
//   );
// };

// export default ToolbarPlugin;

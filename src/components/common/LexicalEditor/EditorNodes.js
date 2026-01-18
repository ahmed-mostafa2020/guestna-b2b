import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { MarkNode } from "@lexical/mark";

const EditorNodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  LinkNode,
  AutoLinkNode,
  HorizontalRuleNode,
  CodeNode,
  CodeHighlightNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  MarkNode,
];

export default EditorNodes;

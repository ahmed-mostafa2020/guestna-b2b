import { memo } from "react";
import { Delete } from "@mui/icons-material";

const FormSectionHeader = ({ title, subtitle, onRemove, removeLabel }) => (
  <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-bold font-somar text-titleColor">{title}</h3>
      {subtitle && (
        <p className="text-xs font-somar text-textLight">{subtitle}</p>
      )}
    </div>

    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        title={removeLabel}
        className="shrink-0 p-1 rounded-md text-error transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
      >
        <Delete sx={{ fontSize: 32 }} />
      </button>
    )}
  </div>
);

export default memo(FormSectionHeader);

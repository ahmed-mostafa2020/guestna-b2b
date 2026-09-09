const FormSectionCard = ({ title, subtitle, action, children }) => {
  return (
    <section className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-6">
      {(title || subtitle || action) && (
        <header className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            {title && (
              <h3 className="text-xl font-medium text-textDark font-somar">
                {title}
              </h3>
            )}
            {action}
          </div>
          {subtitle && (
            <p className="text-base font-medium text-textLight font-somar">
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
};

export default FormSectionCard;

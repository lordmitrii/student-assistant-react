const Accordion = ({ items, parentId, renderHeader, renderBody }) => {
  return items.map((item, index) => {
    const collapseId = `${parentId}-collapse-${index}`;
    const headingId = `${parentId}-heading-${index}`;

    return (
      <div className="accordion-item" key={index}>
        <h2 className="accordion-header" id={headingId}>
          <button
            className="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#${collapseId}`}
            aria-expanded="false"
            aria-controls={collapseId}
          >
            {renderHeader(item)}
          </button>
        </h2>
        <div
          id={collapseId}
          className="accordion-collapse collapse"
          aria-labelledby={headingId}
          data-bs-parent={`#${parentId}`}
        >
          <div className="accordion-body">{renderBody(item)}</div>
        </div>
      </div>
    );
  });
};

export default Accordion;

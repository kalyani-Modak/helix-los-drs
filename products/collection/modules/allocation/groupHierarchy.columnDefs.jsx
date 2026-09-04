import { definitionLabel } from "./groupHierarchy.mappers";

export function getGroupHierarchyColumnDefs(intl, { onOpenDefinition } = {}) {
  return [
    {
      headerName: intl.formatMessage({
        id: "label.GroupHierarchy.HierarchyCode",
        defaultMessage: "Hierarchy Code",
      }),
      field: "hierarchyCode",
      flex: 0.9,
      editable: (params) =>
        params.data?._isNew === true || params.data?.mode === "N",
      required: true,
      valueSetter: (params) => {
        const next = String(params.newValue ?? "").toUpperCase();
        params.data.hierarchyCode = next;
        return true;
      },
    },
    {
      headerName: intl.formatMessage({
        id: "label.GroupHierarchy.HierarchyDescription",
        defaultMessage: "Hierarchy Description",
      }),
      field: "description",
      flex: 1.4,
      editable: true,
      required: true,
    },
    {
      headerName: intl.formatMessage({
        id: "label.GroupHierarchy.Definition",
        defaultMessage: "Definition",
      }),
      field: "definition",
      flex: 1.1,
      editable: false,
      sortable: false,
      cellRenderer: (params) => {
        if (!params?.data) return "";
        return (
          <button
            type="button"
            className="group-hierarchy-definition-link"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenDefinition?.(params.data);
            }}
          >
            {definitionLabel(params.data, intl)}
          </button>
        );
      },
    },
    {
      headerName: intl.formatMessage({
        id: "label.GroupHierarchy.Active",
        defaultMessage: "Active",
      }),
      field: "active",
      flex: 0.45,
      editable: true,
      cellRenderer: "agCheckboxCellRenderer",
      cellEditor: "agCheckboxCellEditor",
      valueSetter: (params) => {
        const val = params.newValue;
        if (typeof val === "boolean") {
          params.data.active = val;
        } else {
          const str = String(val ?? "").trim().toLowerCase();
          params.data.active = ["y", "yes", "true", "1", "on"].includes(str);
        }
        return true;
      },
    },
  ];
}

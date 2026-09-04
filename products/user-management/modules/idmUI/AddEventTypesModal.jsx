import { useEffect, useState, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { EventTypesAPI } from "./apiEndpoints";
import { HAxiosService, HLabel, HButton, HCheckBox, HAgGrid } from "@helix/component-library";
import { useIntl } from 'react-intl';

const AddEventTypesModal = ({ open, onClose }) => {
  const intl = useIntl();
  const [eventTypes, setEventTypes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const realm = sessionStorage.getItem('SEC_REALM');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchAvailableEventTypes = async (pageNumber = 0, pageSizeValue = 10) => {
    setLoading(true);
    try {
      const getUrl = EventTypesAPI.FETCH_DISABLED(pageNumber, pageSizeValue);
      const response = await HAxiosService.GET(getUrl);
      const data = response.data;

      setEventTypes(data.content || []);
      setTotalElements(data.totalElements || 0); // Important: use totalElements for TablePagination
    } catch (error) {
      console.error('Error fetching disabled event types:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAvailableEventTypes(page, pageSize);
    }
  }, [open, page, pageSize]); // page and pageSize are dependencies now

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setPage(0); // Reset to first page
  };

  const saveSelectedEventTypes = async () => {
    if (selected.length === 0) {
      return;
    }
  
    try {
      const postUrl = EventTypesAPI.UPDATE_ENABLED();
      const payload = {
        eventList: selected,
        enableEventsList: true
      };
  
      const response = await HAxiosService.PUT(postUrl, payload);
  
      if (response.data?.status === 'SUCCESS') {
        onClose();
      } else {
        console.error('Saving event types failed:', response.data);
      }
    } catch (error) {
      console.error('Error saving event types:', error);
    }
  };
  
  const handleToggle = (type) => {
    setSelected((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const handleAdd = () => {
    saveSelectedEventTypes();
  };

  const handleRefresh = () => {
    fetchAvailableEventTypes(page, pageSize);
  };

  const columnDefs = useMemo(() => [
    {
      headerName: "",
      field: "selected",
      width: 50,
      suppressMenu: true,
      sortable: false,
      filter: false,
      cellRenderer: (params) => {
        const type = params.data?.type;
        return (
          <HCheckBox
            checked={selected.includes(type)}
            onChange={() => handleToggle(type)}
            gridMode
          />
        );
      }
    },
    {
      headerName: intl.formatMessage({ id: "label.addEventTypes.col.type", defaultMessage: "Event saved type" }),
      field: "eventName",
      minWidth: 200,
      flex: 1
    },
    {
      headerName: intl.formatMessage({ id: "label.addEventTypes.col.description", defaultMessage: "Description" }),
      field: "description",
      minWidth: 250,
      flex: 2
    }
  ], [selected, intl]);

  return (
    <Dialog
      open={open}
      onClose={(e, reason) => {
        if (reason === 'backdropClick') {
          e.stopPropagation();
        } else {
          onClose();
        }
      }}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
      style={{ marginTop: '2rem' }}
    >
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side: Title + Refresh */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <HLabel
              value="label.addEventTypes.title"
              translate={true}
              colon={false}
              align="left"
              sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}
            />
            <IconButton onClick={handleRefresh} size="small">
              <RefreshIcon fontSize="small" />
            </IconButton>
          </div>

          {/* Right side: Pagination */}
          {/* <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handlePageSizeChange}
            rowsPerPageOptions={[10, 20, 50]}
            labelRowsPerPage={intl.formatMessage({ id: "label.addEventTypes.pagination.rowsPerPage", defaultMessage: "Rows per page" })}
            style={{ marginRight: '-16px' }}
          /> */}
        </div>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <HAgGrid
          rowData={eventTypes}
          columnDefs={columnDefs}
          gridStyle={{ width: "100%", height: "100%" }}
          pagination
          paginationPageSize={10}
          gridClassName="drs-list-grid"
          isLoading={loading}
          globalSearch={false}
        />
      </DialogContent>

      <DialogActions>
        <HButton
          label="label.addEventTypes.button.cancel"
          variant="outlined"
          onClick={onClose}
        />
        <HButton
          label="label.addEventTypes.button.add"
          variant="contained"
          onClick={handleAdd}
          disabled={selected.length === 0}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddEventTypesModal;

import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText,
  CircularProgress, Pagination, InputAdornment, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { HBox, HLabel, HButton, HTextField, HRadio, HDialog } from "@helix/component-library";
import { useIntl } from 'react-intl';

const PAGE_SIZE = 6;

const AddStepDialog = ({ open, onClose, providers = [], parentExecution, onAdd }) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const theme = useTheme();
  const intl = useIntl();

  const filtered = useMemo(() => {
    const list = Array.isArray(providers) ? providers : [];
    const s = (search || '').toLowerCase();
    return list.filter(p => {
      const name = (p.displayName || p.providerId || p.id || '').toString().toLowerCase();
      const desc = (p.description || '').toString().toLowerCase();
      return !s || name.includes(s) || desc.includes(s);
    });
  }, [providers, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = () => {
    const list = Array.isArray(providers) ? providers : [];
    const selected = list.find(p => (p.id || p.providerId || p.provider || p.name) === selectedId) || null;
    // Pass back selected provider object (if any)
    onAdd?.(selected);
  };

  const titleVal = parentExecution
    ? intl.formatMessage({ id: "label.authAddStep.titleWithParent", defaultMessage: "Add step to {parent}" }, { parent: parentExecution?.displayName ?? parentExecution?.id })
    : intl.formatMessage({ id: "label.authAddStep.title", defaultMessage: "Add step" });

  return (
    <HDialog
      open={Boolean(open)}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      title={titleVal}
      titleSx={{ fontWeight: 600 }}
      contentProps={{ dividers: true }}
      actions={
        <HBox sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, background: "transparent" }}>
          <HButton label={intl.formatMessage({id: "label.authAddStep.cancel", defaultMessage: "Cancel"})} onClick={onClose} variant="outlined" color="inherit"/>
          <HButton label={intl.formatMessage({id: "label.authAddStep.add", defaultMessage: "Add"})} onClick={handleAdd} variant="contained" disabled={!selectedId}/>
        </HBox>
      }
    >
        <HBox sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <HTextField
            name="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            editable
            fullWidth
            placeholder={intl.formatMessage({id: "label.authAddStep.search", defaultMessage: "Search"})}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: theme.palette.background.paper,
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }
            }}
          />
        </HBox>

        {providers == null ? (
          <HBox sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </HBox>
        ) : (
          <List>
            {pageItems.map((p) => {
              const key = p.providerId || p.id || p.name || JSON.stringify(p);
              const idVal = p.providerId || p.id || p.name;
              return (
              <ListItem
                key={key}
                button
                onClick={() => setSelectedId(idVal)}
                selected={idVal === selectedId}
                alignItems="flex-start"
              >
                <HRadio
                  checked={idVal === selectedId}
                  value={idVal}
                  onChange={() => setSelectedId(idVal)}
                  label=" "
                />
                <ListItemText
                  primary={p.displayName || idVal}
                  secondary={p.description}
                  sx={{ ml: 1 }}
                />
              </ListItem>
              );
            })}
          </List>
        )}

        <HBox sx={{ display: 'flex', justifyContent: 'center', mt: 1, background: "transparent" }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, v) => setPage(v)}
            size="small"
          />
        </HBox>
    </HDialog>
  );
};

export default AddStepDialog;

AddStepDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAdd: PropTypes.func,
  parentExecution: PropTypes.shape({
    displayName: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  providers: PropTypes.arrayOf(PropTypes.object)
};

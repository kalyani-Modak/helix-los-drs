import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';
import { HBox, HButton, HDropdown, HTextField, HTextarea, HDialog } from "@helix/component-library";
import { useIntl } from 'react-intl';

const AddSubFlowDialog = ({ open, onClose, formProviders = [], parentExecution, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [flowType, setFlowType] = useState('Generic');
  const intl = useIntl();
  const theme = useTheme();

  const handleAdd = () => {
    if (!name.trim()) {
      return; // Optionally add validation feedback
    }
    onAdd?.({
      name,
      description,
      flowType
    });
    // Reset form
    setName('');
    setDescription('');
    setFlowType('Generic');
  };

  const handleClose = () => {
    // Reset form on close
    setName('');
    setDescription('');
    setFlowType('Generic');
    onClose();
  };

  const title = parentExecution ? `Add sub-flow to ${parentExecution?.displayName ?? parentExecution?.id}` : 'Add sub-flow';

  return (
    <HDialog
      open={Boolean(open)}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      title={title}
      titleSx={{ fontWeight: 600 }}
      contentProps={{ dividers: true }}
      actions={
        <HBox sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, background: "transparent" }}>
          <HButton label={intl.formatMessage({id: "label.authAddStep.cancel", defaultMessage: "Cancel"})} onClick={handleClose} variant="outlined" color="inherit"/>
          <HButton label={intl.formatMessage({id: "label.authAddStep.add", defaultMessage: "Add"})} onClick={handleAdd} variant="contained" disabled={!name.trim()}/>
        </HBox>
      }
    >
        <HBox sx={{ display: 'flex', flexDirection: 'column', gap: 2, background: "transparent" }}>
          <HTextField
            fullWidth
            name="Name"
            placeholder={intl.formatMessage({id: "label.authAddStep.name", defaultMessage: "Enter sub-flow name *"})}
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            editable
            required
            slotProps={{ htmlInput: { required: true } }}
          />

          <HTextarea
            width="100%"
            name="Description"
            placeholder={intl.formatMessage({id: "label.authAddStep.desc", defaultMessage: "Enter sub-flow description"})}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            multiline
            rows={2}
          />

          {/* <FormControl fullWidth size="small">
            <InputLabel>Flow type</InputLabel>
            <Select
              value={flowType}
              label="Flow type"
              onChange={(e) => setFlowType(e.target.value)}
            >
              <MenuItem value="Generic">Generic</MenuItem>
              <MenuItem value="Form">Form</MenuItem>
            </Select>
          </FormControl> */}
          <HDropdown
            value={flowType}
            onChange={(e) => setFlowType(e.target.value)}
            options={[
                { value: 'Generic', label: intl.formatMessage({ id: "label.authAddStep.generic", defaultMessage: "Generic" }) },
                { value: 'Form', label: intl.formatMessage({ id: "label.authAddStep.form", defaultMessage: "Form" }) },
            ]}
            width="100%"
          />
        </HBox>
    </HDialog>
  );
};

export default AddSubFlowDialog;

AddSubFlowDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAdd: PropTypes.func,
  formProviders: PropTypes.arrayOf(PropTypes.object),
  parentExecution: PropTypes.shape({
    displayName: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

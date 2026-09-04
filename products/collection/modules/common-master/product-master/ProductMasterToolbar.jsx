import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { HButton, HDropdown, HLabel, HBox } from "@helix/component-library";


const ProductMasterToolbar = ({
  portfolio,
  portfolioOptions,
  onPortfolioChange,
  onFetch,
  loading = false,
}) => {
  const intl = useIntl();

  return (
    <HBox className="product-master-toolbar">
      <HLabel
        value={intl.formatMessage({
          id: "label.ProductMaster.portfolio",
          defaultMessage: "Portfolio Code",
        })}
        sx={{ whiteSpace: "nowrap" }}
      />
      <HDropdown
        name="portfolio"
        value={portfolio}
        onChange={onPortfolioChange}
        options={portfolioOptions}
        width="180px"
        required
      />
      <HButton
        id="productMasterFetch"
        label="label.common.fetch"
        onClick={onFetch}
        disabled={loading}
        loading={loading}
        style={{ minWidth: "150px", height: "30px" }}
      />
    </HBox>
  );
};

ProductMasterToolbar.propTypes = {
  portfolio: PropTypes.string.isRequired,
  portfolioOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
  onPortfolioChange: PropTypes.func.isRequired,
  onFetch: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default ProductMasterToolbar;

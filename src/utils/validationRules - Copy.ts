import { Schema } from "rsuite";
import { AnySchema } from "yup";
import { useLocalization } from "hooks/useLocalization";

// eslint-disable-next-line react-hooks/rules-of-hooks
const _l = useLocalization("ErrorCommon");

export const requiredRule = Schema.Types.StringType().isRequired(
  _l("This field is required")
);
export const requiredOrgRule = Schema.Types.NumberType()
  .addRule((value: any, data: any) => {
    let kq = value == -1;
    return !kq;
  }, _l("This field is required"))
  .isRequired(_l("This field is required"));
export const emailRule = Schema.Types.StringType().isEmail(
  _l("Please enter a valid email address")
);
export const emailRequiredRule = Schema.Types.StringType()
  .isRequired(_l("This field is required"))
  .isEmail(_l("Please enter a valid email address"));

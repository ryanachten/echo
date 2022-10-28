import { Box, FormField, RangeInput } from "grommet";
import { useCallback, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateMaskBlurAmount,
  updateMaskOpacity,
} from "../../reducers/backgroundSlice";
import {
  getMaskBlurAmount,
  getMaskOpacity,
} from "../../selectors/backgroundSelector";

const BlurControls = () => {
  const dispatch = useDispatch();
  const maxOpacity = 1;
  const maxBlur = 30;
  const maskOpacity = useSelector(getMaskOpacity);
  const maskBlurAmount = useSelector(getMaskBlurAmount);

  const updateMaskOpacityAmount = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const amount = parseFloat(event.target.value);
      if (!isNaN(amount)) {
        dispatch(updateMaskOpacity(amount));
      }
    },
    []
  );

  const updateMaskBlur = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(event.target.value, 10);
    if (!isNaN(amount)) {
      dispatch(updateMaskBlurAmount(amount));
    }
  }, []);

  return (
    <Box direction="row">
      <FormField
        label="Mask Opacity"
        margin={{
          right: "small",
        }}
      >
        <RangeInput
          value={maskOpacity}
          max={maxOpacity}
          onChange={updateMaskOpacityAmount}
          step={0.1}
        />
      </FormField>
      <FormField
        label="Edge Blur"
        margin={{
          right: "small",
        }}
      >
        <RangeInput
          value={maskBlurAmount}
          onChange={updateMaskBlur}
          max={maxBlur}
        />
      </FormField>
    </Box>
  );
};

export default BlurControls;

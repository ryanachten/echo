import { Box, FormField, RangeInput } from "grommet";
import { useCallback, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateBackgroundBlurAmount,
  updateEdgeBlurAmount,
} from "../../reducers/backgroundSlice";
import {
  getBackgroundBlurAmount,
  getEdgeBlurAmount,
} from "../../selectors/backgroundSelector";

const BlurControls = () => {
  const dispatch = useDispatch();
  const maxBlur = 30;
  const backgroundBlurAmount = useSelector(getBackgroundBlurAmount);
  const edgeBlurAmount = useSelector(getEdgeBlurAmount);

  const updateBackgroundBlur = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const amount = parseInt(event.target.value, 10);
      if (!isNaN(amount)) {
        dispatch(updateBackgroundBlurAmount(amount));
      }
    },
    []
  );

  const updateEdgeBlur = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(event.target.value, 10);
    if (!isNaN(amount)) {
      dispatch(updateEdgeBlurAmount(amount));
    }
  }, []);

  return (
    <Box direction="row">
      <FormField
        label="Background Blur"
        margin={{
          right: "small",
        }}
      >
        <RangeInput
          value={backgroundBlurAmount}
          max={maxBlur}
          onChange={updateBackgroundBlur}
        />
      </FormField>
      <FormField
        label="Edge Blur"
        margin={{
          right: "small",
        }}
      >
        <RangeInput
          value={edgeBlurAmount}
          onChange={updateEdgeBlur}
          max={maxBlur}
        />
      </FormField>
    </Box>
  );
};

export default BlurControls;

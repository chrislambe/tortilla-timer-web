import { Box, Stack } from "@material-ui/core";
import React from "react";
import { Tortilla } from './Tortilla';

export function App() {
  return (
    <Box display="flex" flex={1} alignItems="center" justifyContent="center">
      <Stack spacing={4}>
        <Tortilla />
        <Tortilla />
        <Tortilla />
      </Stack>
    </Box>
  );
}

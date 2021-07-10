import { Box, FormControlLabel, Stack, Switch } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Tortilla } from "./Tortilla";

export function App() {
  const [whenWakeLock, setWhenWakeLock] = useState<Promise<WakeLockSentinel>>();
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel>();

  useEffect(() => {
    if (whenWakeLock) {
      whenWakeLock.then((value) => setWakeLock(value));
    }
  }, [whenWakeLock]);

  useEffect(() => {
    if (wakeLock) {
      setWhenWakeLock(undefined);
      wakeLock.addEventListener("release", () => {
        setWakeLock(undefined);
      });
    }
  }, [wakeLock]);

  useEffect(() => {
    setWhenWakeLock(navigator.wakeLock.request("screen"));
  }, []);

  return (
    <>
      <Box display="flex" flex={1} alignItems="center" justifyContent="center">
        <Stack spacing={4}>
          <Tortilla />
          <Tortilla />
          <Tortilla />
        </Stack>
      </Box>
      {"wakeLock" in navigator ? (
        <Box position="absolute" right="16px" bottom="16px">
          <FormControlLabel
            onChange={() => {
              if (wakeLock === undefined && whenWakeLock === undefined) {
                setWhenWakeLock(navigator.wakeLock.request("screen"));
              } else if (wakeLock) {
                wakeLock.release();
              }
            }}
            control={<Switch />}
            label="Stay awake"
            checked={Boolean(wakeLock)}
            disabled={Boolean(whenWakeLock)}
          />
        </Box>
      ) : null}
    </>
  );
}

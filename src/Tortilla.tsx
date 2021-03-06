import { Box, Stack, Typography, useTheme } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import useSound from "use-sound";
import alertSound from "./alert.mp3";
import RefreshIcon from "@material-ui/icons/Refresh";

enum Phase {
  First,
  Second,
}

const debugMode = localStorage.getItem("debugMode");

export function Tortilla() {
  const { palette } = useTheme();

  const [phase, setPhase] = useState<Phase>();
  const [timeRemaining, setTimeRemaining] = useState<number>();

  const [playAlert] = useSound(alertSound);

  const endTime = useMemo(() => {
    switch (phase) {
      case Phase.First:
        return Date.now() + (debugMode ? 2000 : 60000);
      case Phase.Second:
        return Date.now() + (debugMode ? 2000 : 45000);
      default:
        return undefined;
    }
  }, [phase]);

  const side = useMemo(() => {
    switch (phase) {
      case Phase.First:
        return "1";
      case Phase.Second:
        return "2";
      default:
        return undefined;
    }
  }, [phase]);

  const bgcolor = useMemo(() => {
    if (timeRemaining === 0) {
      return "#fc0";
    }

    return phase === undefined ? "#c00" : "#0c0";
  }, [phase, timeRemaining]);

  useEffect(() => {
    if (endTime) {
      setTimeRemaining(Math.max(0, endTime - Date.now()));
      const id = window.setInterval(() => {
        setTimeRemaining(Math.max(0, endTime - Date.now()));
      }, 1000);

      return () => window.clearInterval(id);
    } else {
      setTimeRemaining(undefined);
    }
  }, [endTime]);

  useEffect(() => {
    if (timeRemaining === 0) {
      playAlert();
    }
  }, [playAlert, timeRemaining]);

  return (
    <Stack
      bgcolor={bgcolor}
      width={160}
      height={160}
      borderRadius="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={() => {
        switch (phase) {
          case Phase.First:
            return setPhase(Phase.Second);
          case Phase.Second:
            return setPhase(undefined);
          default:
            return setPhase(Phase.First);
        }
      }}
    >
      <Countdown timeRemaining={timeRemaining} />
      {side !== undefined ? (
        <Typography
          gutterBottom={false}
          variant="h5"
          component="span"
          color={palette.common.white}
        >
          Side {side}
        </Typography>
      ) : null}
    </Stack>
  );
}

type CountdownProps = {
  timeRemaining?: number;
};

function Countdown(props: CountdownProps) {
  const { timeRemaining } = props;

  const { palette } = useTheme();

  const formattedTimeRemaining = useMemo(
    () =>
      timeRemaining === undefined ? undefined : Math.ceil(timeRemaining / 1000),
    [timeRemaining]
  );

  if (timeRemaining === 0) {
    return (
      <RefreshIcon sx={{ fontSize: "4em", color: palette.common.white }} />
    );
  }

  return formattedTimeRemaining !== undefined ? (
    <Typography
      gutterBottom={false}
      variant="h2"
      component="span"
      color={palette.common.white}
    >
      {formattedTimeRemaining}
    </Typography>
  ) : null;
}

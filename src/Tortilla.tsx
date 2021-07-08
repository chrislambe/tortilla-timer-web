import { Box } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import useSound from "use-sound";
import alertSound from "./alert.mp3";

enum Phase {
  First,
  Second,
}

export function Tortilla() {
  const [phase, setPhase] = useState<Phase>();
  const [timeRemaining, setTimeRemaining] = useState<number>();

  const [playAlert] = useSound(alertSound);

  const endTime = useMemo(() => {
    switch (phase) {
      case Phase.First:
        return Date.now() + 60000;
      case Phase.Second:
        return Date.now() + 45000;
      default:
        return undefined;
    }
  }, [phase]);

  const formattedTimeRemaining = useMemo(
    () =>
      timeRemaining === undefined ? undefined : Math.ceil(timeRemaining / 1000),
    [timeRemaining]
  );

  const side = useMemo(() => {
    switch (phase) {
      case Phase.First:
        return "one";
      case Phase.Second:
        return "two";
      default:
        return undefined;
    }
  }, [phase]);

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
    <Box
      border={`1px solid ${phase === undefined ? "#c00" : "#0c0"}`}
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
      {side ? `Side ${side}:` : null} {formattedTimeRemaining}
    </Box>
  );
}

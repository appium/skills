#!/usr/bin/env node
import { reportingOptions, writeReport } from "./reporting.mjs";
const outputOptions = reportingOptions();
import {
  commandPath,
  hostReport,
  run,
} from "./env-check-helpers.mjs";

const ffmpegVersion = run("ffmpeg", ["-version"], { timeout: 10000 });
const ffprobeVersion = run("ffprobe", ["-version"], { timeout: 10000 });

const report = {
  host: hostReport(),
  ffmpeg: {
    executables: {
      ffmpeg: commandPath("ffmpeg"),
      ffprobe: commandPath("ffprobe"),
    },
    checks: {
      ffmpegVersion,
      ffprobeVersion,
    },
  },
  summary: {
    requiredOk: ffmpegVersion.ok,
    ffmpegOk: ffmpegVersion.ok,
    ffprobeOk: ffprobeVersion.ok,
    note: "FFmpeg is optional for the Appium setup workflows unless explicitly requested.",
  },
};

writeReport(report, outputOptions);

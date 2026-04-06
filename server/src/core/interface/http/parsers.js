// server/src/core/interface/http/parsers.js
import express from "express";

export function applyHttpParsers(app) {
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
}

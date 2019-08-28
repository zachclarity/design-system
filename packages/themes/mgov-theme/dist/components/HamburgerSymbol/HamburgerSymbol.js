"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Hamburger = function Hamburger() {
  return _react2.default.createElement(
    "svg",
    {
      width: "24px",
      height: "20px",
      viewBox: "0 0 24 20",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      xmlnsXlink: "http://www.w3.org/1999/xlink"
    },
    _react2.default.createElement(
      "title",
      null,
      "Menu"
    ),
    _react2.default.createElement(
      "g",
      { id: "Symbols", stroke: "none", "stroke-width": "1", fill: "none", "fill-rule": "evenodd" },
      _react2.default.createElement(
        "g",
        { id: "Icons/Hamburger", transform: "translate(-5.000000, -7.000000)", fill: "#146A5D" },
        _react2.default.createElement("path", { d: "M28.6785714,9.02247191 L5.32142857,9.02247191 C5.14390847,9.02247191 5,8.87155666 5,8.68539326 L5,7.33707865 C5,7.15091525 5.14390847,7 5.32142857,7 L28.6785714,7 C28.8560915,7 29,7.15091525 29,7.33707865 L29,8.68539326 C29,8.87155666 28.8560915,9.02247191 28.6785714,9.02247191 Z M28.6785714,18.011236 L5.32142857,18.011236 C5.14390847,18.011236 5,17.8603207 5,17.6741573 L5,16.3258427 C5,16.1396793 5.14390847,15.988764 5.32142857,15.988764 L28.6785714,15.988764 C28.8560915,15.988764 29,16.1396793 29,16.3258427 L29,17.6741573 C29,17.8603207 28.8560915,18.011236 28.6785714,18.011236 Z M28.6785714,27 L5.32142857,27 C5.14390847,27 5,26.8490847 5,26.6629213 L5,25.3146067 C5,25.1284433 5.14390847,24.9775281 5.32142857,24.9775281 L28.6785714,24.9775281 C28.8560915,24.9775281 29,25.1284433 29,25.3146067 L29,26.6629213 C29,26.8490847 28.8560915,27 28.6785714,27 Z", id: "Shape" })
      )
    )
  );
};

exports.default = Hamburger;
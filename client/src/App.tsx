import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { Controller } from "./component/controller/controller";
import { Display } from "./component/display/display";
import { Home } from "./component/home/home";
import '@tensorflow/tfjs-backend-webgl';

function App() {
  async function setStyles() {
    document.head.childNodes.forEach(async (el: any) => {
      if (el.nodeName === "LINK") {
        if (el.href.includes(".css")) {
          let url = "";

          el.href
            .split("//")[1]
            .split("/")
            .forEach((str: string, index: number) => {
              if (index !== 0) {
                url += `/${str}`;
              }
            });

          const cssFile = await fetch(url)
            .then((response) => response.body)
            .then((rb: any) => {
              const reader = rb.getReader();

              return new ReadableStream({
                start(controller) {
                  function push() {
                    reader.read().then(({ done, value }: any) => {
                      if (done) {
                        controller.close();
                        return;
                      }
                      controller.enqueue(value);
                      push();
                    });
                  }
                  push();
                },
              });
            })
            .then((stream) =>
              new Response(stream, {
                headers: { "Content-Type": "text/html" },
              }).text()
            )
            .then((result) => {
              return result;
            });

          const styleElem = document.createElement("style")
          styleElem.innerHTML = cssFile

          document.body.appendChild(styleElem)
        }
      }
    });
  }

  useEffect(() => {
    setStyles();
  }, []);

  return (
    <Router>
      <div className="App"></div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/display" element={<Display />}></Route>
        <Route path="/controller" element={<Controller />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

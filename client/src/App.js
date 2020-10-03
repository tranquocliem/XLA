import React, { useState } from "react";
import qr from "qr-encode";

function App() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState("");
  const [qrImg, setQRSrc] = useState("");
  const [showQR, setShowQR] = useState(false);

  const addToList = () => {
    if (!form) return;
    const qrSrc = qr(form, { level: "L", size: 12 });
    list.unshift({ mssv: form, qrSrc, verified: false });
    setList(list);
    setForm("");
  };

  const deleteInList = (idx) => {
    setList([...list.slice(0, idx), ...list.slice(idx + 1)]);
  };

  const updateItem = (idx, verified) => {
    setList([
      ...list.slice(0, idx),
      { ...list[idx], verified },
      ...list.slice(idx + 1),
    ]);
  };

  return (
    <div className="container-fluid">
      <div className="card mx-auto m-5 p-5 col-6 shadow">
        <div className="row">
          <img
            src="https://nctu.edu.vn/dist/image/icon/logo.png"
            style={{
              maxWidth: 150,
              maxHeight: 150,
            }}
            className="mx-auto mb-5"
          />
        </div>
        <div class="input-group mb-3 col-10 mx-auto">
          <input
            type="number"
            class="form-control"
            placeholder="Nhập MSSV..."
            aria-label="Nhập MSSV..."
            value={form}
            onChange={(e) => setForm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addToList();
                return;
              }
              console.log(e.key);
            }}
            minLength="6"
            maxLength="10"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-success"
              type="button"
              onClick={addToList}
            >
              <i className="material-icons pt-2">add</i>
            </button>
          </div>
        </div>
        {!!list.length && (
          <div class="row mb-3 bordered rounded">
            <div className="col col-10 mx-auto">
              <table
                class="table table-hover table-dark"
                style={{ maxHeight: 250, overflow: "auto" }}
              >
                <thead class="thead-inverse">
                  <tr>
                    <th>#</th>
                    <th>MSSV</th>
                    <th>-</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(({ mssv, qrSrc, verified }, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{mssv}</td>
                      <td style={{ userSelect: "none" }}>
                        {(verified && (
                          <i
                            className="material-icons text-success btn-icon mr-3"
                            onClick={() => updateItem(idx, false)}
                          >
                            check_circle_outline
                          </i>
                        )) || (
                          <i
                            className="material-icons text-warning btn-icon mr-3"
                            onClick={() => updateItem(idx, true)}
                          >
                            highlight_off
                          </i>
                        )}
                        <i
                          className="material-icons text-info btn-icon mr-3"
                          onClick={() => setQRSrc(qrSrc)}
                          data-toggle="modal"
                          data-target="#qr"
                        >
                          visibility
                        </i>
                        <i
                          className="material-icons text-danger btn-icon"
                          onClick={() => deleteInList(idx)}
                        >
                          delete
                        </i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div class="modal" tabindex="-1" role="dialog" id="qr">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">QR</h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowQR(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body row">
                <img src={qrImg} className="mx-auto" />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  data-dismiss="modal"
                >
                  OK!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

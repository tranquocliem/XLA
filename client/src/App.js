import React, { useState } from "react";
import axios from "axios";
import QRCode from "qrcode";

function App() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState("");

  const addToList = () => {
    if (!form || form.length < 6 || form.length > 10) {
      alert("MSSV không hợp lệ!");
      return;
    }

    list.push({ mssv: form, verified: false });
    getStudentInfo(form, list.length - 1);
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

  const getQrImg = (idx) => {
    const canvas = document.getElementById("qr-canvas");
    if (list[idx].error)
      QRCode.toCanvas(canvas, JSON.stringify({}), {
        scale: 8,
      });
    else if (canvas !== null)
      QRCode.toCanvas(canvas, JSON.stringify(list[idx]), {
        scale: 8,
      });
  };

  const getStudentInfo = async (mssv, idx) => {
    const { data } = await axios.get(`${mssv}`);
    if (data.error)
      setList([
        ...list.slice(0, idx),
        { mssv, fullname: "Không tìm thấy", avgScore: "Không tìm thấy" },
        ...list.slice(idx + 1),
      ]);
    else setList([...list.slice(0, idx), { ...data }, ...list.slice(idx + 1)]);
  };

  return (
    <div className="container-fluid">
      <div className="card mx-auto m-5 p-5 col-9 shadow bg-dark">
        <div className="row">
          <img
            src="https://nctu.edu.vn/dist/image/icon/logo.png"
            alt="logo"
            style={{
              maxWidth: 150,
              maxHeight: 150,
            }}
            className="mx-auto mb-5"
          />
        </div>
        <div className="input-group mb-3 col-10 mx-auto">
          <input
            type="number"
            className="form-control add-item-inp px-3"
            placeholder="Nhập MSSV..."
            aria-label="Nhập MSSV..."
            value={form}
            onChange={(e) => setForm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addToList();
                return;
              }
            }}
            autoFocus
          />
        </div>
        {!!list.length && (
          <div
            className="row mb-3 bordered rounded"
            style={{ padding: "15px" }}
          >
            <div className="col col-10 mx-auto">
              <table
                className="table table-hover table-dark"
                style={{ maxHeight: 250, overflow: "auto" }}
              >
                <thead className="thead-inverse">
                  <tr>
                    <th style={{ width: 50 }}>#</th>
                    <th style={{ width: 150 }}>MSSV</th>
                    <th>Họ tên</th>
                    <th style={{ width: 180 }}>TB chung tích luỹ</th>
                    <th style={{ width: 150 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(({ mssv, fullname, avgScore, verified }, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{mssv}</td>
                      <td>{fullname}</td>
                      <td>{avgScore}</td>
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
                          onClick={() => getQrImg(idx)}
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
      </div>
      <div className="modal" tabIndex="-1" role="dialog" id="qr">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">QR</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body row">
              {/* <img src={getQrImg()} alt="qr-code"/> */}
              <canvas id="qr-canvas" className="mx-auto"></canvas>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary btn-block"
                data-dismiss="modal"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

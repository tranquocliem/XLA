const exp = require("express");
const app = require("express")();
const axios = require("axios");
const cors = require("cors");

app.use(exp.json());
app.use(cors());

app.get("/:mssv", async (req, res) => {
  const { data } = await axios.post(
    "http://student.nctu.edu.vn/ajaxpro/TraCuuThongTin,PMT.Web.PhongDaoTao.ashx",
    {
      currentPage: 1,
      maSinhVien: req.params.mssv,
      hoDem: "",
      Ten: "",
      ngaySinh: "",
      maLopHoc: "",
    },
    {
      headers: {
        "X-AjaxPro-Method": "GetDanhSachSinhVien",
      },
    }
  );

  const s = data.split("?k=")[1];

  if (s !== undefined) {
    const id = s.split("\\")[0];
    const { data: pgXemDiem } = await axios.get(
      `http://student.nctu.edu.vn/XemDiem.aspx?k=${id}`
    );

    const AVG_SCORE_SPAN_ID =
      "ctl00_ContentPlaceHolder_ucThongTinTotNghiepTinChi1_lblTBCTL";
    const startAvgScoreIndex =
      pgXemDiem.indexOf(AVG_SCORE_SPAN_ID) + AVG_SCORE_SPAN_ID.length + 5;
    const endAvgScoreIndex = pgXemDiem.indexOf("/span", startAvgScoreIndex) - 5;
    const avgScore = pgXemDiem
      .slice(startAvgScoreIndex, endAvgScoreIndex)
      .split(".")
      .join(",");

    let startFullNameIndex = pgXemDiem.indexOf('class="title-group"');
    const endFullNameIndex = pgXemDiem.indexOf("/div", startFullNameIndex) - 1;
    const fullNameDiv = pgXemDiem.slice(startFullNameIndex, endFullNameIndex);
    startFullNameIndex += fullNameDiv.lastIndexOf("\n") + 2;
    const fullname = pgXemDiem
      .slice(startFullNameIndex, endFullNameIndex)
      .trim()
      .toLowerCase()
      .split(" ")
      .map(([w0, ...w]) => [w0.toUpperCase(), ...w].join(""))
      .join(" ");

    res.json({ error: false, id, avgScore, fullname, mssv: req.params.mssv });
  } else {
    res.json({ error: true });
  }
});

app.listen(5000);

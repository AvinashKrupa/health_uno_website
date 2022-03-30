import moment from "moment";
import React, { useEffect, useState } from "react";
import { API, post } from "../../../api/config/APIController";
import { Colors } from "../../../utils/Colors";
import Image from "react-bootstrap/Image";
export default function PatientDetailView(props) {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState(null);

  const [patientInfo, setPatientInfo] = useState([
    {
      question: "Diabetic Since",
      answer: "",
      date: "",
      isSelected: false,
      briefQuest: "",
      briefAns: "",
    },
    {
      question: "Hypertensive Since",
      answer: "",
      date: "",
      isSelected: false,
      briefQuest: "",
      briefAns: "",
    },
    {
      question: "Past Surgeries",
      answer: "",
      date: "",
      isSelected: false,
      briefQuest: "",
      briefAns: "",
    },
    {
      question: "Allergies to medications",
      answer: "",
      date: "",
      isSelected: false,
      briefQuest: "",
      briefAns: "",
    },
    {
      question: "Diagnosed with covid",
      answer: "",
      date: "",
      isSelected: false,
      briefQuest: "Covid illness",
      briefAns: "",
      dose_type: "",
      vaccine_name: "",
    },
    {
      question: "Vaccinated again covid",
      answer: "",
      date: "",
      isSelected: false,
      briefQuest: "",
      briefAns: "",
      dose_type: "",
      vaccine_name: "",
    },
    {
      question: "Other Medical Conditions",
      answer: "",
      date: "",
      isSelected: false,
      briefQuest: "",
      briefAns: "",
    },
  ]);

  useEffect(() => {
    getPatientProfile();
  }, []);

  function getPatientProfile() {
    setLoading(true);
    let params = { patient_id: props.match.params.patient_id };
    post(API.GETPATIENTPROFILE, params)
      .then(async (response) => {
        if (response.status == 200) {
          let obj = {
            ...response.data.data,
            ...response.data.data.user_id,
          };
          setDataSource(obj);
          console.log(obj);
          setMedicineData(response.data.data);
        } else {
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  function setMedicineData(medi) {
    medi.med_cond.forEach((data) => {
      switch (data.name) {
        case "diabetic": {
          patientInfo[0].date = data.diag_at
            ? moment(data.diag_at).format("DD-MMM-YYYY")
            : "";
          patientInfo[0].isSelected = data.selected || false;
          break;
        }

        case "hypertensive": {
          patientInfo[1].date = data.diag_at
            ? moment(data.diag_at).format("DD-MMM-YYYY")
            : "";
          patientInfo[1].isSelected = data.selected || false;
          break;
        }

        case "past_surgeries": {
          patientInfo[2].briefAns = data.desc;
          patientInfo[2].isSelected = data.selected || false;
          break;
        }

        case "allergy_to_meds": {
          patientInfo[3].briefAns = data.desc;
          patientInfo[3].isSelected = data.selected || false;
          break;
        }

        case "diagnosed_with_covid": {
          patientInfo[4].date = data.diag_at
            ? moment(data.diag_at).format("DD-MMM-YYYY")
            : "";
          patientInfo[4].isSelected = data.selected || false;
          break;
        }

        case "covid_vaccinated": {
          if (data.selected) {
            patientInfo[5].date = data.diag_at
              ? moment(data.diag_at).format("DD-MMM-YYYY")
              : "";
            data.meta.map((dataInfo) => {
              if (dataInfo.name == "dose_type") {
                patientInfo[5].dose_type = dataInfo.desc;
              } else if (dataInfo.name == "vaccine_name") {
                patientInfo[5].vaccine_name = dataInfo.desc;
              }
            });
          }

          break;
        }

        default:
          break;
      }
    });

    if (medi.other_med_cond) {
      patientInfo[6].briefAns = medi.other_med_cond;
      patientInfo[6].isSelected = medi.other_med_cond ? true : false;
    }

    setPatientInfo(JSON.parse(JSON.stringify(patientInfo)));
  }

  function _renderMedicalInfo(left, right) {
    if (right == "" && right.length == 0) {
      return;
    }
    return (
      <div style={{ marginTop: 24, marginHorizontal: 16 }}>
        <p
          style={{
            fontSize: 15,
            color: Colors.black,
            backgroundColor: Colors.white,
          }}
        >
          {left}
        </p>

        <p
          style={{
            fontSize: 14,
            marginTop: 24,
            color: Colors.black,
            backgroundColor: Colors.white,
          }}
        >
          {right}
        </p>
      </div>
    );
  }

  function renderCovidVaccinated(data) {
    console.log(data);
    return (
      <div style={{ marginTop: 24, marginHorizontal: 16 }}>
        <p
          style={{
            fontSize: 15,
            color: Colors.black,
            backgroundColor: Colors.white,
          }}
        >
          {data.question}
        </p>
        <div style={{ flexDirection: "row" }}>
          <p
            style={{
              fontSize: 14,
              marginTop: 16,
              color: Colors.black,
              backgroundColor: Colors.white,
            }}
          >
            {"Date of vaccination: "}
          </p>

          <p
            style={{
              fontSize: 14,
              marginTop: 16,
              color: Colors.black,
              backgroundColor: Colors.white,
            }}
            title={data.date}
          >
            {data.date}
          </p>
        </div>

        <div style={{ flexDirection: "row" }}>
          <p
            style={{
              fontSize: 14,
              marginTop: 16,
              color: Colors.black,
              backgroundColor: Colors.white,
            }}
          >
            {"Dose Type: "}
          </p>

          <p
            style={{
              fontSize: 14,
              marginTop: 16,
              color: Colors.black,
              backgroundColor: Colors.white,
            }}
          >
            {data.dose_type}
          </p>
        </div>

        <div style={{ flexDirection: "row" }}>
          <p
            style={{
              fontSize: 14,
              marginTop: 16,
              color: Colors.black,
              backgroundColor: Colors.white,
            }}
          >
            {"Vaccine Name: "}
          </p>

          <p
            style={{
              fontSize: 14,
              marginTop: 16,
              color: Colors.black,
              backgroundColor: Colors.white,
            }}
          >
            {data.vaccine_name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {dataSource && (
        <div className="main-body">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <div className="mt-3">
                      <img
                        src={dataSource.dp}
                        style={{ width: "50%" }}
                        className="square bg-primary rounded-circle"
                        alt="patient profile"
                      ></img>

                      <h4 className="mt-2">{`${dataSource.first_name} ${dataSource.last_name}`}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row ml-2 mb-4">
            <div className="col-lg-10 offset-lg-1">
              <h5 class="d-flex align-items-center mb-3 mt-4 ">Information</h5>
              <div className="card">
                <div className="card-body pt-3">
                  {patientInfo.map((info, index) => {
                    let question = "";
                    let answer = "";
                    if (info.date != "") {
                      question = info.question;
                      answer = info.date;
                    } else if (info.answer) {
                      question = info.question;
                      answer = info.answer;
                    } else {
                      question = info.question;
                      answer = info.briefAns;
                    }

                    if (index == 5) {
                      return (
                        <>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-2">
                                <div className="row">
                                  <h5 class="d-flex align-items-center mb-3">
                                    {info.question}
                                  </h5>
                                  <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 class="mb-0">Date of vaccination: </h6>
                                    <span class="text-secondary">
                                      {info.date}
                                    </span>
                                  </li>
                                  <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 class="mb-0">Dose Type:</h6>
                                    <span class="text-secondary">
                                      {info.dose_type}
                                    </span>
                                  </li>
                                  <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 class="mb-0">Vaccine Name:</h6>
                                    <span class="text-secondary">
                                      {info.vaccine_name}
                                    </span>
                                  </li>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6"></div>
                          </div>
                        </>
                      );
                    }
                    if (answer) {
                      return (
                        <>
                          <h5 class="d-flex align-items-center mb-1">
                            {question}
                          </h5>
                          <p>{answer}</p>
                        </>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

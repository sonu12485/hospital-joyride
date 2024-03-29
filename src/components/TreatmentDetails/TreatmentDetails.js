import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firestoreConnect,
  isLoaded,
  isEmpty,
  withFirestore
} from "react-redux-firebase";
import { getFirestore } from "redux-firestore";
import { Link } from "react-router-dom";
import store from "../../store";

import { Icon, Placeholder, Segment, Button, Message } from "semantic-ui-react";
import { Icon as AntIcon, Table } from "antd";

class TreatmentDetails extends Component {
  state = {
    doctor: null
  };

  componentDidUpdate() {
    if (!this.state.doctor) {
      if (this.props.treatment && this.props.treatment.assignedDoc) {
        this.getDoc(this.props.treatment.assignedDoc);
      }
    }
  }

  getDoc = async id => {
    const firestore = getFirestore();
    let data = await firestore
      .collection("doctors")
      .doc(id)
      .get();
    data = data.data();

    this.setState({
      doctor: data
    });
  };

  render() {
    if (this.props.current_user !== "parent") {
      this.props.history.push("/");
    }
    const { doctor } = this.state;
    const columns = [
      {
        title: "Tablet Name",
        dataIndex: "tabletName",
        key: "tabletName"
      },
      {
        title: "Timing",
        dataIndex: "timing",
        key: "timing"
      },
      {
        title: "Lunch",
        dataIndex: "lunch",
        key: "lunch",
        render: x => {
          if (x === 0) {
            return (
              <AntIcon
                type="close-circle"
                theme="twoTone"
                twoToneColor="#eb2f96"
              />
            );
          } else {
            let a = [];
            for (let i = 1; i <= x; i++) {
              a.push(
                <AntIcon
                  type="check-circle"
                  theme="twoTone"
                  twoToneColor="#52c41a"
                  key={i}
                />
              );
            }

            return a;
          }
        }
      },
      {
        title: "Dinner",
        dataIndex: "dinner",
        key: "dinner",
        render: x => {
          if (x === 0) {
            return (
              <AntIcon
                type="close-circle"
                theme="twoTone"
                twoToneColor="#eb2f96"
              />
            );
          } else {
            let a = [];
            for (let i = 1; i <= x; i++) {
              a.push(
                <AntIcon
                  type="check-circle"
                  theme="twoTone"
                  twoToneColor="#52c41a"
                  key={i}
                />
              );
            }

            return a;
          }
        }
      }
    ];

    const DietColumns = [
      {
        title: "Recommended Food",
        dataIndex: "food",
        key: "food"
      },
      {
        title: "Doctor's Recommendation",
        dataIndex: "recommendation",
        align: 'center',
        key: "recommendation",
        render: x => {
          if(x === "recommended") {
            return (<AntIcon
              type="check-circle"
              theme="twoTone"
              twoToneColor="#52c41a"
              style={{ margin: "0 auto" }}
            />)
          } else {
            return (<AntIcon
              type="close-circle"
              theme="twoTone"
              twoToneColor="#eb2f96"
              style={{ margin: "0 auto" }}
            />)
          }
        }
      }
    ]

    let diets, new_diets, key = 1;
    if(this.props.treatment && this.props.treatment.mustEat) {
      diets = this.props.treatment.mustEat.map((item, index) => {
        key = key + 1;
        return {
          key: key,
          food: item.name,
          recommendation: "recommended"
        }
      })
    }

    if (this.props.treatment && this.props.treatment.mustNotEat) {
      new_diets = this.props.treatment.mustNotEat.map((item, index) => {
        key = key + 1;
        return {
          key: key,
          food: item.name,
          recommendation: "not-recommended"
        }
      })
    }

    let dataSource;
    if (this.props.treatment && this.props.treatment.meds) {
      dataSource = this.props.treatment.meds.map((med, index) => {
        med = med.split(",");
        return {
          key: index + 1,
          tabletName: med[0],
          timing: med[2],
          lunch: med[3] === "true" ? med[1] : 0,
          dinner: med[4] === "true" ? med[1] : 0
        };
      });
    }

    return (
      <div style={{ marginBottom: "1rem" }} className="page-container">
        {this.props.treatment ? (
          <>
            <div className="header">
              <div>
                <Icon name="user" circular size="big" />
              </div>
              <div style={{ paddingLeft: "30px", width: "100%" }}>
                <div
                  className="header-name"
                  style={{ textTransform: "capitalize" }}
                >
                  {this.props.treatment.childName}
                </div>
              </div>
            </div>
            <div className="body">
              <div className="body-tag">
                <div>Gender: </div>
                <div>Age: </div>
                <div>Blood Group:</div>
                <div>Symptoms: </div>
                {this.props.treatment.symptoms.map((s, index) => {
                  if (index === 0) {
                    return null;
                  }
                  return <br key={index}></br>;
                })}
                {this.props.treatment.isDiagnosed ? <div>Disease: </div> : null}
              </div>
              <div className="body-details">
                <div>{this.props.treatment.gender}</div>
                <div>{this.props.treatment.age}</div>
                <div>{this.props.treatment.bloodGroup}</div>
                <div>
                  {this.props.treatment.assignedDoc
                    ? null
                    : "We are searching!!"}
                </div>
                {this.props.treatment.symptoms.map((symptom, index) => (
                  <div key={index} style={{ textTransform: "capitalize" }}>
                    {symptom}
                  </div>
                ))}
                {this.props.treatment.isDiagnosed ? (
                  <div>{this.props.treatment.disease}</div>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
        {this.props.treatment && this.props.treatment.medicalHistory ? (
          <div className="body">
            <div className="body-desc">
              <div>Medical History: </div>
              <hr></hr>
              <div style={{ fontWeight: "500" }}>
                {this.props.treatment.medicalHistory}
              </div>
            </div>
          </div>
        ) : null}
        {this.props.treatment && this.props.treatment.ongoingTreatments ? (
          <div className="body">
            <div className="body-desc">
              <div>On Going Medical Condition: </div>
              <hr></hr>
              <div style={{ fontWeight: "500" }}>
                {this.props.treatment.ongoingTreatments}
              </div>
            </div>
          </div>
        ) : null}
        {doctor ? (
          <div className="body">
            <div className="body-tag">
              <div>Doctor Assigned: </div>
              <div>Phone Number: </div>
              <div>Email:</div>
              <div>Hospital: </div>
              <div>Qualification: </div>
              <div>Specialization: </div>
            </div>
            <div className="body-details">
              <div>{doctor.name}</div>
              <div>{doctor.phone}</div>
              <div>{doctor.email}</div>
              <div>{doctor.hospital}</div>
              <div>{doctor.qualification}</div>
              <div>{doctor.specialization}</div>
            </div>
          </div>
        ) : null}
        {this.props.treatment &&
        this.props.treatment.appointmentDate &&
        this.props.treatment.appointmentTime ? (
          <div className="body">
            <div className="body-tag">
              <div>Appointment Date: </div>
              <div>Appointment Time: </div>
            </div>
            <div className="body-details">
              <div>{this.props.treatment.appointmentDate}</div>
              <div>{this.props.treatment.appointmentTime}</div>
            </div>
          </div>
        ) : null}
        {this.props.treatment && this.props.treatment.isDiagnosed ? (
          <div className="body">
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              style={{ width: "100%" }}
            />
          </div>
        ) : null}

        {this.props.treatment && this.props.treatment.mustEat ?
          <div className="body">
            <Table
              dataSource={[...diets, ...new_diets]}
              columns={DietColumns}
              pagination={false}
              style={{ width: "100%" }}
            />
          </div>
         : null}

        {/* {this.props.treatment && this.props.treatment.mustNotEat ?
          <div className="body">
            <Table
              dataSource={mustNotEat}
              columns={MustNotEatDietColumns}
              pagination={false}
              showHeader={false}
              style={{ width: "100%" }}
            />
          </div>
        : null} */}

        {this.props.treatment && this.props.treatment.diet ? (
          <div>
            <div className="body-desc" style={{ width: "100%" }}>
              <div>Diet Description: </div>
              <hr></hr>
              <div style={{ fontWeight: "500" }}>
                {this.props.treatment.diet}
              </div>
            </div>
          </div>
        ) : null}

        {this.props.treatment && !this.props.treatment.isCompleted && (
          <div className="body">
            <div
              className="body-desc"
              style={{
                width: "100%",
                padding: "1.5rem",
                display: "flex",
                justifyContent: "center"
              }}
            >
              <Button
                icon
                labelPosition="right"
                positive
                onClick={() => {
                  this.props.history.push(`/story/${this.props.treatment.id}`);
                }}
              >
                Start Adventure
                <Icon name="right arrow" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  treatment: state.firestore.ordered.treatment
    ? state.firestore.ordered.treatment[0]
    : null,
  current_user: state.current_user.current_user
});

export default withFirestore(
  compose(
    firestoreConnect(props => [
      {
        collection: "treatments",
        doc: props.match.params.id,
        storeAs: "treatment"
      }
    ]),
    connect(mapStateToProps)
  )(TreatmentDetails)
);

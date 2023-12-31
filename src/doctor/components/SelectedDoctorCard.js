import { Card, CardContent, CardMedia } from "@material-ui/core";
import { delete_icon } from "../../constants/DoctorImages";

const SelectedDoctorCard = (props) => {
  return (
    <>
      <Card className="selected-doctor-container">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="image-profile-container">
            <CardMedia className="image" image={props?.image}></CardMedia>
          </div>
          <div>
            <CardContent>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div className="name">{props.name}</div>
                  <div className="description">{props?.details}</div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <span
                      // className="doctor-card-specialization-text"
                      style={{ marginTop: "10px" }}
                    >
                      {props?.qualifications?.map((s) => {
                        return (
                          <span
                            key={s}
                            style={{ padding: "5px", marginRight: "10px" }}
                            className="specialities-text"
                          >
                            {s}
                          </span>
                        );
                      })}
                    </span>
                  </div>
                </div>
                {props.showRemoveAction && (
                  <div>
                    <img
                      alt="delete"
                      className="delete-button"
                      src={delete_icon}
                      onClick={() => props.removeSelectedDoctor()}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </>
  );
};
export default SelectedDoctorCard;

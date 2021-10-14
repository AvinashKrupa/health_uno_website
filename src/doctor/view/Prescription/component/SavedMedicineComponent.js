import { Col } from "react-bootstrap";
import React from "react";
import Typography from "@material-ui/core/Typography";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export default function SavedMedicineComponent(props) {
  const { name, _id, prescription_info } = props.template;
  return (
    <Col key={`accord-${_id}`} className="choosetempCol" xs={12} md={6}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions1-content"
          id="additional-actions1-header"
        >
          <FormControlLabel
            aria-label="Acknowledge"
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            control={
              <Radio
                value={props.index}
                onChange={() => props.handleChooseTemplate(props.index)}
                checked={props.chosenTemplate === props.index}
              />
            }
            label={name}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="textSecondary">
            {prescription_info.map((item, index, arr) => {
              let renderLine;
              if (index !== arr.length - 1) {
                renderLine = <hr />;
              }
              return (
                <>
                  <div className="MedList">
                    <p>
                      <div>Medicine Name</div>
                      <span>{item.medicine.name} </span>
                    </p>
                    <p>
                      <div>Time Slot</div>
                      {item.time_slots.map((item, index, arr) => (
                        <span>
                          {`${item}${index !== arr.length - 1 ? "," : ""}`}{" "}
                        </span>
                      ))}
                    </p>
                    <p>
                      <div>No. of Pills</div>
                      <span>{item.dosage.dosage_text} </span>
                    </p>
                    <p>
                      <div>Dosage</div>
                      <span>{item.dosage.qty} </span>
                    </p>
                  </div>
                  {renderLine}
                </>
              );
            })}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Col>
  );
}

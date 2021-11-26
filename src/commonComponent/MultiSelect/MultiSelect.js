import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { Form } from "react-bootstrap";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { MenuProps, useStyles } from "./utils";

const MultiSelect = ({ label, options, selected, handleChange, className }) => {
  const classes = useStyles();

  return (
    <FormControl className={`${className} ${classes.formControl}`}>
      <Form.Label className={classes.label}>{label}</Form.Label>
      <Select
        labelId="mutiple-select-label"
        multiple
        className={classes.select}
        value={selected}
        onChange={handleChange}
        renderValue={(selected) =>{
          return selected.map((obj) => options.find(option=>option.id == obj).value).join(", ")
        }}
        MenuProps={MenuProps}
        disableUnderline
      >
        {options.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            <ListItemIcon>
              <Checkbox checked={selected.indexOf(option.id) > -1} />
            </ListItemIcon>
            <ListItemText primary={option.value} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;

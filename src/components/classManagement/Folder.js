import React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import Typography from "@material-ui/core/Typography";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import FolderIcon from "@material-ui/icons/Folder";
import GavelIcon from "@material-ui/icons/Gavel";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import {withRouter} from 'react-router-dom'
import { connect } from "net";
import { deleteClass } from "../../actions/classAction";

const useTreeItemStyles = makeStyles(theme => ({
  root: {
    "&:focus > $content": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: "var(--tree-view-color)"
    }
  },
  content: {
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "$expanded > &": {
      fontWeight: theme.typography.fontWeightRegular
    }
  },

  expanded: {},
  label: {
    fontWeight: "inherit",
    color: "inherit"
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
    minHeight: "40px"
  },
  labelIcon: {
    marginRight: theme.spacing(1)
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1
  }
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {
    id,
    type,
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    color,
    bgColor,
    ...other
  } = props;

  const out = e => {
    e.stopPropagation();
    if (props.nodeId > 2) {
      document
        .getElementById(props.id)
        .querySelector(".deleteBtn").style.display = "none";
      document
        .getElementById(props.id)
        .querySelector(".editBtn").style.display = "none";
    }
  };

  const over = e => {
    e.stopPropagation();
    if (props.nodeId > 2) {
      document
        .getElementById(props.id)
        .querySelector(".deleteBtn").style.display = "block";
      document
        .getElementById(props.id)
        .querySelector(".editBtn").style.display = "block";
    }
  };

  const onEdit = (e) => {
    e.stopPropagation();
    console.log("edit");
  };

  const onDeleteClick = (id, e) => {
    e.stopPropagation();
    if (props.nodeId > 2) {
      props.delete2(id);
    }
  };

  return (
    <TreeItem
      onMouseOut={out}
      onMouseOver={over}
      label={
        <div className={classes.labelRoot} id={id}>
          <LabelIcon color="inherit" className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>

          <div className="deleteBtn" style={{ display: "none", color: "red" }}>
            {/* De */}
            <i
              onClick={(e) => {
                onDeleteClick(id, e);
              }}
              className="material-icons md-18"
            >
              delete_forever
            </i>
          </div>

          <div className="editBtn" style={{ display: "none", color: "blue" }}>
            {/* Ed */}
            <i onClick={(e) => {onEdit(e)}} className="material-icons md-18">
              edit
            </i>
          </div>
          {/* )} */}
        </div>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
        padding: "0"
      }}
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired
};

const useStyles = makeStyles({
  root: {
    minHeight: 264,
    flexGrow: 1,
    maxWidth: 400
  }
});

function GmailTreeView(props) {
  const style = useStyles();
  const {
    test,
    student,
    name1,
    classStudent,
    changeTreeStatus,
    role,
    changeTeacherState,
    changeCurrentClassId
  } = props;
  const onItemClick = (id, name, teacherId) => {
    student(id);
    if (role === 1) {
      classStudent(id);
      changeCurrentClassId(id);
    }

    name1(name);
    changeTreeStatus(true);
    changeTeacherState(teacherId);
  };

  const role2OnClick = () => {
    changeTreeStatus(true);
  };

  const setFalse = () => {
    changeTreeStatus(false);
  };

  return (
    <TreeView
      className={style.root}
      defaultExpanded={["3"]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 22 }} />}
    >
      {role === 2 ? (
        <div>
          <StyledTreeItem
            nodeId="1"
            labelText="Danh sách giáo viên"
            labelIcon={FolderSharedIcon}
            onClick={setFalse}
          />
          <StyledTreeItem
            nodeId="2"
            labelText="Danh sách lớp học"
            labelIcon={FolderIcon}
            onClick={role2OnClick}
          />
        </div>
      ) : (
        <div>
          <StyledTreeItem
            nodeId="1"
            labelText="Danh sách học sinh"
            labelIcon={FolderSharedIcon}
            onClick={setFalse}
            // href="http://localhost:3000/studentManagement/studentList"
           // onClick={()=>{props.history.push('/studentManagement/studentList')}}
          />
          <StyledTreeItem
            nodeId="2"
            labelText="Danh sách lớp học"
            labelIcon={FolderIcon}
          >
            {test.map((item, index) => {
              return (
                <StyledTreeItem
                  id={item.id}
                  type="ex"
                  key={index}
                  nodeId={(item.id + 2).toString()}
                  labelText={item.name}
                  labelIcon={GavelIcon}
                  color="#1a73e8"
                  bgColor="#e8f0fe"
                  delete2={props.delete1}
                  onClick={() => {
                    onItemClick(item.id, item.name);
                  }}
                />
              );
            })}
          </StyledTreeItem>
        </div>
      )}
    </TreeView>
  );
}

export default withRouter(GmailTreeView);
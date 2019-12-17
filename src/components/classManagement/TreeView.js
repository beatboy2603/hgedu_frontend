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

  return (
    <TreeItem
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
          </div>

          <div className="editBtn" style={{ display: "none", color: "blue" }}>
            {/* Ed */}
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

export default function TreeViewParent(props) {
  const style = useStyles();
  const { dataItem, parentGetTeacherFunc, changeName } = props;

  const onParentClick = (userId, name) => {
    parentGetTeacherFunc(userId);
    changeName(name);
  }

  return (
    <TreeView
      className={style.root}
      defaultExpanded={["3"]}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 22 }} />}
    >
      <div>
        <StyledTreeItem
          nodeId="1"
          labelText="Danh sách con cái"
          labelIcon={FolderIcon}
        >
          {dataItem.map((item, index) => {
            return (
              <StyledTreeItem
                id={index}
                type="ex"
                key={index}
                nodeId={(index + 2).toString()}
                labelText={item.fullName}
                labelIcon={GavelIcon}
                color="#1a73e8"
                bgColor="#e8f0fe"
                onClick={() => {onParentClick(item.userId, item.fullName)}}
                
              />
            );
          })}
        </StyledTreeItem>
      </div>
    </TreeView>
  );
}

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import MailIcon from '@material-ui/icons/Mail';
import DescriptionIcon from '@material-ui/icons/Description';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import DeleteIcon from '@material-ui/icons/Delete';
import Label from '@material-ui/icons/Label';
import Folder from '@material-ui/icons/Folder';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import InfoIcon from '@material-ui/icons/Info';
import ForumIcon from '@material-ui/icons/Forum';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { withRouter } from 'react-router-dom';

const useTreeItemStyles = makeStyles(theme => ({
    root: {
        // color: theme.palette.text.secondary,
        color: "#424242",
        '&:focus > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: 'var(--tree-view-color)',
        },
    },
    // hover: {
    //     "&:hover": {
    //         backgroundColor: "white",
    //     }
    // },
    content: {
        // color: theme.palette.text.secondary,
        color: "#424242",
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: 0,
        '& $content': {
            paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
        minHeight: "40px", //height of each item
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
}));

function StyledTreeItem(props) {
    const classes = useTreeItemStyles();
    const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other } = props;

    const over = e => {
        e.stopPropagation();
        if (props.parentFolderId !== 0 && !props.hasChildren && props.id !== 4) {
            document.getElementById(props.id).querySelector(".deleteFolderBtn").style.display = "block";
        }
        if (props.parentFolderId !== 0) {
            document.getElementById(props.id).querySelector(".editFolderBtn").style.display = "block";
        }
    };
    const out = e => {
        e.stopPropagation();
        if (props.parentFolderId !== 0 && !props.hasChildren && props.id !== 4) {
            document.getElementById(props.id).querySelector(".deleteFolderBtn").style.display = "none";
        }
        if (props.parentFolderId !== 0) {
            document.getElementById(props.id).querySelector(".editFolderBtn").style.display = "none";
        }
    };

    return (
        <TreeItem onMouseOver={over} onMouseOut={out}
            label={
                <div className={classes.labelRoot}>
                    <LabelIcon color="inherit" className={classes.labelIcon} />
                    <Typography variant="body2" className={classes.labelText}>
                        {labelText}
                    </Typography>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                    <div className="deleteFolderBtn" style={{ display: "none", color: "red" }} onClick={() => { props.deleteFolder(props.id) }}>
                        {/* De */}
                        <i className="material-icons md-18">delete_forever</i>
                    </div>
                    <div className="editFolderBtn" style={{ display: "none", color: "blue" }} onClick={() => { alert(props.id) }}>
                        {/* Ed */}
                        <i className="material-icons md-18">edit</i>
                    </div>
                </div>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            classes={{
                root: classes.root,
                content: classes.content,
                expanded: classes.expanded,
                group: classes.group,
                label: classes.label,
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
    labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
    root: {
        minHeight: 264,
        flexGrow: 1,
        maxWidth: 400,
    },
});

function CustomizedTreeView(props) {
    const classes = useStyles();

    const { folders, setCurrentFolder } = props;

    const handleClick = (folder, subType, path) => {
        props.history.push('/personalLibrary/' + path + "/" + folder.folderId);
        setCurrentFolder(folder.folderId, folder.folderTypeId, subType);
    }

    const foldersToTree = (folders) => {
        let rootFolders = rootFoldersFilter(folders);
        rootFolders[0].subType = "knowledgeGroup";
        rootFolders[1].subType = "test";
        rootFolders[2].subType = "groups";
        // rootFolders[3].subType = "notification";
        return recursiveTree(folders, rootFolders)
    }

    let rootFoldersFilter = (folders) => {
        return folders.filter(folder => {
            return folder.parentFolderId == 0;
        })
    }

    const recursiveTree = (folders, rootFolders) => {
        return rootFolders.map(folder => {
            let subfolders = folders.filter(subfolder => {
                if (subfolder.parentFolderId == folder.folderId) {
                    subfolder.subType = folder.subType;
                    return true;
                }
                return false;
            })
            if (subfolders.length > 0) {
                return (
                    <StyledTreeItem nodeId={folder.folderId.toString()} labelText={folder.folderName} labelIcon={Folder} color="#1a73e8"
                        bgColor="#e8f0fe" key={folder.folderId} id={folder.folderId} parentFolderId={folder.parentFolderId} hasChildren={true} onClick={() => setCurrentFolder(folder, folder.subType)}>
                        <div style={{ paddingLeft: "10px" }}>{recursiveTree(folders, subfolders)}</div>
                    </StyledTreeItem>
                )
            } else {
                if (folder.folderTypeId == 1) {
                    return <StyledTreeItem deleteFolder={props.deleteFolder} nodeId={folder.folderId.toString()} labelText={folder.folderName} labelIcon={FolderOpenIcon} color="#1a73e8"
                        bgColor="#e8f0fe" key={folder.folderId} id={folder.folderId} parentFolderId={folder.parentFolderId} hasChildren={false} onClick={() => setCurrentFolder(folder, folder.subType)} />
                } else if (folder.folderTypeId == 2) {
                    return <StyledTreeItem deleteFolder={props.deleteFolder} nodeId={folder.folderId.toString()} labelText={folder.folderName} labelIcon={DescriptionIcon} color="#1a73e8"
                        bgColor="#e8f0fe" key={folder.folderId} id={folder.folderId} parentFolderId={folder.parentFolderId} hasChildren={false} onClick={() => handleClick(folder, folder.subType, "knowledgeGroup")} />
                } else if (folder.folderTypeId == 3) {
                    return <StyledTreeItem deleteFolder={props.deleteFolder} nodeId={folder.folderId.toString()} labelText={folder.folderName} labelIcon={DescriptionIcon} color="#1a73e8"
                        bgColor="#e8f0fe" key={folder.folderId} id={folder.folderId} parentFolderId={folder.parentFolderId} hasChildren={false} onClick={() => handleClick(folder, folder.subType, "test")} />
                } else {
                    return <StyledTreeItem deleteFolder={props.deleteFolder} nodeId={folder.folderId.toString()} labelText={folder.folderName} labelIcon={FolderOpenIcon} color="#1a73e8"
                        bgColor="#e8f0fe" key={folder.folderId} id={folder.folderId} parentFolderId={folder.parentFolderId} hasChildren={false} onClick={() => setCurrentFolder(folder, folder.subType)} />
                }
            }
        })
    }

    const folderNav = folders ? (
        foldersToTree(folders)
    ) : (
            <div className="center">No folders yet</div>
        )

    return (
        <TreeView
            className={classes.root}
            // defaultExpanded={['2']}
            defaultCollapseIcon={<ArrowDropDownIcon />}
            defaultExpandIcon={<ArrowRightIcon />}
            defaultEndIcon={<div style={{ width: 22 }} />}
        >
            <StyledTreeItem style={{ display: "none" }} nodeId="0" labelText="" labelIcon={DeleteIcon} />
            {/* <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon} />
            <StyledTreeItem nodeId="3" labelText="Categories" labelIcon={Label}>
                <StyledTreeItem
                    nodeId="5"
                    labelText="Social"
                    labelIcon={SupervisorAccountIcon}
                    labelInfo="90"
                    color="#1a73e8"
                    bgColor="#e8f0fe"
                />
                <StyledTreeItem
                    nodeId="6"
                    labelText="Updates"
                    labelIcon={InfoIcon}
                    labelInfo="2,294"
                    color="#e3742f"
                    bgColor="#fcefe3"
                />
                <StyledTreeItem
                    nodeId="7"
                    labelText="Forums"
                    labelIcon={ForumIcon}
                    labelInfo="3,566"
                    color="#a250f5"
                    bgColor="#f3e8fd"
                />
                <StyledTreeItem
                    nodeId="8"
                    labelText="Promotions"
                    labelIcon={LocalOfferIcon}
                    labelInfo="733"
                    color="#3c8039"
                    bgColor="#e6f4ea"
                />
            </StyledTreeItem>
            <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} /> */}
            {folderNav}
        </TreeView>
    );
}

export default withRouter(CustomizedTreeView);
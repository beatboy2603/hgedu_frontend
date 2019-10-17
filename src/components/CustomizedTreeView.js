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

    return (
        <TreeItem
            label={
                <div className={classes.hover}>
                    <div className={classes.labelRoot}>
                        <LabelIcon color="inherit" className={classes.labelIcon} />
                        <Typography variant="body2" className={classes.labelText}>
                            {labelText}
                        </Typography>
                        <Typography variant="caption" color="inherit">
                            {labelInfo}
                        </Typography>
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
        height: 264,
        flexGrow: 1,
        maxWidth: 400,
    },
});

function CustomizedTreeView(props) {
    const classes = useStyles();

    const { folders, setCurrentFolderId } = props;

    const handleClick = (folderId, folderTypeId, path) => {
        props.history.push('/personalLibrary/' + path + "/" + folderId);
        setCurrentFolderId(folderId, folderTypeId);
    }

    const foldersToTree = (folders) => {
        let rootFolders = rootFoldersFilter(folders);
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
                return subfolder.parentFolderId == folder.folderId;
            })
            if (subfolders.length > 0) {
                return (
                    <StyledTreeItem nodeId={folder.folderId.toString()} labelText={folder.folderName} labelIcon={Folder} color="#1a73e8"
                        bgColor="#e8f0fe" key={folder.folderId} id={folder.folderId} onClick={() => setCurrentFolderId(folder.folderId, folder.folderTypeId)}>
                        <div style={{ paddingLeft: "10px" }}>{recursiveTree(folders, subfolders)}</div>
                    </StyledTreeItem>
                )
            } else {
                if (folder.folderTypeId == 1) {
                    return <StyledTreeItem nodeId={folder.folderId.toString()} labelText={folder.folderName} labelIcon={FolderOpenIcon} color="#1a73e8"
                        bgColor="#e8f0fe" key={folder.folderId} id={folder.folderId} onClick={() => setCurrentFolderId(folder.folderId, folder.folderTypeId)}/>
                } else if (folder.folderTypeId == 2) {
                    return <StyledTreeItem nodeId={folder.folderId.toString()} labelText={folder.folderName} labelIcon={DescriptionIcon} color="#1a73e8"
                        bgColor="#e8f0fe" key={folder.folderId} id={folder.folderId} onClick={() => handleClick(folder.folderId, folder.folderTypeId, "knowledgeGroup")} />
                } else if (folder.folderTypeId == 3) {
                    return <StyledTreeItem nodeId={folder.folderId.toString()} labelText={folder.folderName} labelIcon={DescriptionIcon} color="#1a73e8"
                        bgColor="#e8f0fe" key={folder.folderId} id={folder.folderId} onClick={() => handleClick(folder.folderId, folder.folderTypeId, "test")} />
                } else {
                    return <StyledTreeItem nodeId={folder.folderId.toString()} labelText={folder.folderName} labelIcon={FolderOpenIcon} color="#1a73e8"
                        bgColor="#e8f0fe" key={folder.folderId} id={folder.folderId} onClick={() => setCurrentFolderId(folder.folderId, folder.folderTypeId)}/>
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
            {/* <StyledTreeItem nodeId="1" labelText="All Mail" labelIcon={MailIcon} />
            <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon} />
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
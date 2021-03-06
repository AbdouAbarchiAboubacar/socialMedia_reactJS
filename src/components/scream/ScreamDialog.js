import React, { Component, Fragment } from 'react';
import propTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';

//Redux
import { connect } from 'react-redux';

// MUI stuff
import { Dialog, DialogTitle, DialogContent, Button, CircularProgress, Grid, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
//Icons
import UnfolMore from '@material-ui/icons/UnfoldMore';
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';

import MyButtons from '../../utils/MyButtons';
import { Link } from 'react-router-dom';
import { getScream, clearErrors } from '../../redux/actions/dataActions';

const styles = (theme) => ({
    ...theme.spreadThis,
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    DialogContent: {
        padding: '20px'
    },
    closeButton: {
        position: 'absolute',
        left: '90%'
    },
    expandButton: {
        position: 'absolute',
        left: '90%'
    },
    spinnerDiv: {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 50
    }
});

class ScreamDialog extends Component {
    state = {
        open: false,
        oldPath: '',
        newPath: ''
    }
    componentDidMount() {
        if (this.props.openDialog) {
            this.handleOpen();
        }
    }
    handleOpen = () => {
        let oldPath = window.location.pathname;
        const { userHandle, screamsId } = this.props;
        const newPath = `/user/${userHandle}/scream/${screamsId}`;
        if (oldPath === newPath) {
            oldPath = `/user/${userHandle}`;
        }

        window.history.pushState(null, null, newPath);

        this.setState({ open: true, oldPath, newPath });
        this.props.getScream(this.props.screamsId);
    }
    handleClose = () => {
        window.history.pushState(null, null, this.state.oldPath);
        this.setState({ open: false });
        this.props.clearErrors();
    };

    render() {
        const { classes,
            scream: { screamId, body, createAt, likeCount, commentCount, userImage, userHandle, comments },
            UI: { loading } } = this.props;

        const dialogMarkup = loading ? (
            <div className={classes.spinnerDiv}>
                <CircularProgress size={200} thickness={2} />
            </div>
        ) : (
                <Grid container spacing={16}>
                    <Grid item sm={5}>
                        <img src={userImage} alt="Profile" className={classes.profileImage} />
                    </Grid>
                    <Grid item sm={7}>
                        <Typography component={Link} color="primary" variant="h5" to={`/user/${userHandle}`}>
                            @{userHandle}
                        </Typography>
                        <hr className={classes.invisibleSeparator} />
                        <Typography variant="body2" color="textSecondary">
                            {dayjs(createAt).format('h:mm a, MMMM DD YYYY')}
                        </Typography>
                        <hr className={classes.invisibleSeparator} />
                        <Typography variant="body1">
                            {body}
                        </Typography>

                        <LikeButton screamsId={screamId} />

                        <span>{likeCount} Likes</span>
                        <MyButtons tip="comments">
                            <ChatIcon color="primary" />
                        </MyButtons>
                        <span>{commentCount} comments</span>

                    </Grid>
                    <hr className={classes.visibleSeparator} />
                    <CommentForm screamsId={screamId} />
                    <Comments comments={comments} />
                </Grid>
            );
        return (
            <Fragment>
                <MyButtons onClick={this.handleOpen} tip="Expand scream" tipClassName={classes.expandButton}>
                    <UnfolMore color="primary" />
                </MyButtons>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButtons tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon />
                    </MyButtons>
                    <DialogContent className={classes.DialogContent}>
                        {dialogMarkup}
                    </DialogContent>

                </Dialog>
            </Fragment>
        );
    }
};

ScreamDialog.propTypes = {
    getScream: propTypes.func.isRequired,
    screamsId: propTypes.string.isRequired,
    userHandle: propTypes.string.isRequired,
    scream: propTypes.object.isRequired,
    UI: propTypes.object.isRequired,
    clearErrors: propTypes.func.isRequired,

};

const mapStateToProps = state => ({
    scream: state.data.scream,
    UI: state.UI
});
const mapActionsToProps = {
    getScream, clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ScreamDialog));


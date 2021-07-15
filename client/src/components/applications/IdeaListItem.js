import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardBody, Badge, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import Comment from './MessageCard';
import { Colxx } from '../common/CustomBootstrap';
import AddNewIdea from '../../containers/applications/AddNewIdea';
import { voteUp, voteDown, deleteIdea, addComment } from '../../redux/actions';
// import { auth } from '../../helpers/Firebase';
const TodoListItem = ({ item }) => {
  const { authID } = useSelector(({ authUser }) => authUser);
  const user = {};
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const [isComment, setIsComment] = useState(false);
  const clickLike = () => {
    if (item.dislikeUsers.includes(authID))
      dispatch(voteUp({ authID: authID, ideaid: item.id, isDisliked: true }));
    else if (item.likeUsers.includes(authID)) return;
    else
      dispatch(voteUp({ authID: authID, ideaid: item.id, isDisliked: false }));
  };
  const clickDelete = () => {
    const isDelete = window.confirm('Are you sure delete this idea?');
    if (isDelete) dispatch(deleteIdea(item.id));
  };
  const clickDislike = () => {
    if (item.likeUsers.includes(authID))
      dispatch(voteDown({ authID: authID, ideaid: item.id, isLiked: true }));
    else if (item.dislikeUsers.includes(authID)) return;
    else
      dispatch(voteDown({ authID: authID, ideaid: item.id, isLiked: false }));
  };
  const clickComment = () => {
    setIsComment(!isComment);
  };

  const postComment = () => {
    const comment = document.getElementById('comment').innerHTML;

    dispatch(addComment({ ideaid: item.id, comment }));
    document.getElementById('comment').innerHTML = '';
  };
  return (
    <Colxx xxs='12'>
      <Card className='card d-flex mb-3 mt-1'>
        <div className='d-flex flex-grow-1 min-width-zero'>
          <CardBody className='align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center'>
            <NavLink
              to='#'
              location={{}}
              id={`toggler${item.id}`}
              className='list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1'
            >
              <i
                alt='cloase'
                className={`${
                  item.status === 'COMPLETED'
                    ? 'simple-icon-check heading-icon'
                    : item.status === 'PENDING'
                    ? 'simple-icon-light heading-icon'
                    : item.status === 'DEVELOPMENT'
                    ? 'simple-icon-drawer heading-icon'
                    : 'simple-icon-close heading-icon'
                }`}
              />
              <span className='align-middle d-inline-block'>
                <strong>{item.title}</strong>
              </span>
            </NavLink>

            <p className='mb-1 text-muted text-small w-15 w-xs-100'>
              Created by {item.username}
            </p>
            <p className='mb-1 text-muted text-small w-15 w-xs-100'>
              Created at {item.createDate}
            </p>
            <div className='w-15 w-xs-100'>
              {authID === item.authID ? (
                <Badge color='primary' pill onClick={(e) => toggleModal()}>
                  Edit Idea
                </Badge>
              ) : (
                ''
              )}
            </div>
          </CardBody>
        </div>
        <div className='card-body pt-1'>
          <p className='mb-0'>{item.detail}</p>
        </div>
        <div className='text-center m-2'>
          <span className='left-corner'>
            <i
              className='simple-icon-comment heading-icon  '
              onClick={() => clickComment()}
            />
            {item &&
              item.comments &&
              item.comments.length &&
              `(${item.comments.length})`}
          </span>
          <img
            alt='thumbsup'
            src='/assets/img/thumsup.svg'
            width='30px'
            className='thumbsup'
            onClick={() => clickLike()}
          />
          <span>
            <strong style={{ color: '#dd6c46' }}>
              {item &&
                item.likeUsers &&
                item.dislikeUsers &&
                item.likeUsers.length - item.dislikeUsers.length}
            </strong>
          </span>
          <img
            alt='thumbsup'
            src='/assets/img/thumsdown.svg'
            width='30px'
            className='thumbsup'
            onClick={() => clickDislike()}
          />
          {authID === item.authID ? (
            <i
              className='simple-icon-trash heading-icon right-corner'
              onClick={() => clickDelete()}
            />
          ) : (
            ''
          )}
        </div>
      </Card>
      {isComment && (
        <div className='pl-4 pr-4'>
          <div className='d-flex'>
            <img
              alt='avatar'
              className='avatar'
              width='30px'
              height='30px'
              src={user.photoURL ? user.photoURL : '/assets/img/nexusF-19.png'}
            ></img>
            <div
              contentEditable='true'
              type='text'
              id='comment'
              className='comment_input mb-2'
              placeholder='commnet here'
            />
          </div>
          <div style={{ marginLeft: '50px' }}>
            <Button onClick={() => postComment()} className='pt-2 pb-2'>
              Comment
            </Button>
          </div>
          {item &&
            item.comments &&
            item.comments.map((comment, index) => {
              return (
                <Comment data={comment} key={'comment.id' + index}></Comment>
              );
            })}
        </div>
      )}

      <AddNewIdea toggleModal={toggleModal} modalOpen={modalOpen} item={item} />
    </Colxx>
  );
};

export default React.memo(TodoListItem);

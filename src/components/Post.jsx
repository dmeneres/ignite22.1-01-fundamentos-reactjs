import { Avatar } from './Avatar';
import { Comment } from './Comment';

import styles from './Post.module.css';

import { format, formatDistanceToNow } from 'date-fns'
import en from 'date-fns/locale/en-US'
import { useState } from 'react';

export function Post({ author, publishedAt, content }) {
  const [comments, setComments] = useState([
    'Generic Comment'
  ])

  const [newCommentText, setNewCommentText] = useState('')

  const publishedDateFormatted = format(publishedAt, "LLLL do 'at' HH:mm", {
    locale: en,
  })

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: en,
    addSuffix: true
  })

  function handleCreateNewComment() {
    event.preventDefault()
    
    setComments([...comments, newCommentText])
    setNewCommentText('')
  }

  function handleNewCommentChange() {
    event.target.setCustomValidity('');
    setNewCommentText(event.target.value)
  }

  function handleNewCommentInvalid() {
    event.target.setCustomValidity('This field is mandatory');
  }

  function deleteComment(commentToDelete) {
    const commentsWithoutDeletedOne = comments.filter(comment => {
      return comment !== commentToDelete;
    })

    setComments(commentsWithoutDeletedOne);
  }

  const isNewCommentEmpty = newCommentText.length === 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>
        <time title={publishedDateFormatted} dateTime={publishedAt.toISOString()}>
          {publishedDateRelativeToNow}
        </time>
      </header>
      <div className={styles.content}>
        {content.map(line => {
          if (line.type === 'paragraph') {
            return <p key={line.content} >{line.content}</p>;
          } else if (line.type === 'link') {
            return (
              <p key={line.content} >
                <a href={line.content}>{line.slug}</a>
              </p>
            );
          }
        })}
      </div>
      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Feedback</strong>
        <textarea
          name="comment"
          placeholder="Leave a comment"
          value={newCommentText}
          onChange={handleNewCommentChange}
          onInvalid={handleNewCommentInvalid}
          required
        />
        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>Publicar</button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map(comment => {
          return (
            <Comment 
              key={comment} 
              content={comment} 
              onDeleteComment={deleteComment} 
            />
          )
        })}
      </div>
    </article>
  )
}
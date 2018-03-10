package com.fgm.flow.dao;

import com.fgm.flow.core.Comment;
//import static java.lang.System.out;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import com.fgm.flow.core.QComment;
import com.querydsl.jpa.impl.JPAQueryFactory;

/**
 *
 * @author fgm
 */
@Stateless
public class CommentRegistry extends AbstractQuery<Comment, Integer>
{

    @PersistenceContext(unitName = "flow_pu")
    private EntityManager em;
      

    public CommentRegistry()
    {
        super(Comment.class, QComment.comment);
    }

    @Override
    public EntityManager getEntityManager()
    {
        return em;
    }
    @Override
    public void setEntityManager(EntityManager em)
    {
        this.em = em;
    }
    
    public List<Comment> findById(int id)
    {
        evictClassEntities();
        QComment comment = QComment.comment;
        JPAQueryFactory qf = new JPAQueryFactory(em);
        List<Comment> found = qf.select(comment)
                .from(comment)
                .where(comment.id.eq(id))
                .fetch();
        return found;
    }
}
package com.fgm.flow.dao;

import com.fgm.flow.core.Post;
//import static java.lang.System.out;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import com.fgm.flow.core.QPost;
import com.querydsl.jpa.impl.JPAQueryFactory;

/**
 *
 * @author fgm
 */
@Stateless
public class PostRegistry extends AbstractQuery<Post, Integer>
{

    @PersistenceContext(unitName = "flow_pu")
    private EntityManager em;
      

    public PostRegistry()
    {
        super(Post.class, QPost.post);
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
    
    public List<Post> findById(int id)
    {
        evictClassEntities
        QPost post = QPost.post;
        JPAQueryFactory qf = new JPAQueryFactory(em);
        List<Post> found = qf.select(post)
                .from(post)
                .where(post.id.eq(id))
                .fetch();
        return found;
    }
}
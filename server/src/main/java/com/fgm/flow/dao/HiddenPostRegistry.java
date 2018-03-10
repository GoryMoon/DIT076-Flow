package com.fgm.flow.dao;

import com.fgm.flow.core.User;
import com.fgm.flow.core.HiddenPost;
import com.fgm.flow.core.HiddenPost.HiddenPostId;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import com.fgm.flow.core.QHiddenPost;
import com.querydsl.jpa.impl.JPAQueryFactory;

/**
 *
 * @author fgm
 */
@Stateless
public class HiddenPostRegistry extends AbstractQuery<HiddenPost, HiddenPostId>
{

    @PersistenceContext(unitName = "flow_pu")
    private EntityManager em;
      

    public HiddenPostRegistry()
    {
        super(HiddenPost.class, QHiddenPost.hiddenPost);
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
    
    public List<HiddenPost> findByUser(User user)
    {
        evictClassEntities();
        QHiddenPost hiddenPost = QHiddenPost.hiddenPost;
        JPAQueryFactory qf = new JPAQueryFactory(em);
        List<HiddenPost> found = qf.select(hiddenPost)
                .from(hiddenPost)
                .where(hiddenPost.user.eq(user))
                .fetch();
        return found;
    }
}
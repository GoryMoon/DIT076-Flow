package com.fgm.flow.dao;

import com.fgm.flow.core.User;
//import static java.lang.System.out;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import com.fgm.flow.core.QUser;
import com.querydsl.jpa.impl.JPAQueryFactory;

/**
 *
 * @author fgm
 */
@Stateless
public class UserRegistry extends AbstractQuery<User, Integer>
{

    @PersistenceContext(unitName = "flow_pu")
    private EntityManager em;
      

    public UserRegistry()
    {
        super(User.class, QUser.user);
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
    
    public List<User> findByNick(String nick)
    {
        evictClassEntities();
        QUser user = QUser.user;
        JPAQueryFactory qf = new JPAQueryFactory(em);
        List<User> found = qf.select(user)
                .from(user)
                .where(user.nick.eq(nick))
                .fetch();
        return found;
    }
    
    public List<User> findByEmail(String email)
    {
        evictClassEntities();
        QUser user = QUser.user;
        JPAQueryFactory qf = new JPAQueryFactory(em);
        List<User> found = qf.select(user)
                .from(user)
                .where(user.email.eq(email))
                .fetch();
        return found;
    }
}
package com.fgm.flow.dao;

import com.fgm.flow.core.UserGroup;
//import static java.lang.System.out;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import com.fgm.flow.core.QUserGroup;
import com.querydsl.jpa.impl.JPAQueryFactory;

/**
 *
 * @author fgm
 */
@Stateless
public class UserGroupRegistry extends AbstractQuery<UserGroup, Integer>
{

    @PersistenceContext(unitName = "flow_pu")
    private EntityManager em;
      

    public UserGroupRegistry()
    {
        super(UserGroup.class, QUserGroup.userGroup);
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
    
    public List<UserGroup> findByName(String name)
    {
        evictClassEntities();
        QUserGroup uGroup = QUserGroup.userGroup;
        JPAQueryFactory qf = new JPAQueryFactory(em);
        List<UserGroup> found = qf.select(uGroup)
                .from(uGroup)
                .where(uGroup.name.eq(name))
                .fetch();
        return found;
    }
}
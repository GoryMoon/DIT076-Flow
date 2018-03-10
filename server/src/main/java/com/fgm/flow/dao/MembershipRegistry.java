package com.fgm.flow.dao;

import com.fgm.flow.core.User;
import com.fgm.flow.core.Membership;
import com.fgm.flow.core.Membership.MembershipId;
//import static java.lang.System.out;
import java.util.List;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import com.fgm.flow.core.QMembership;
import com.querydsl.jpa.impl.JPAQueryFactory;

/**
 *
 * @author fgm
 */
@Stateless
public class MembershipRegistry extends AbstractQuery<Membership, MembershipId>
{

    @PersistenceContext(unitName = "flow_pu")
    private EntityManager em;
      

    public MembershipRegistry()
    {
        super(Membership.class, QMembership.membership);
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
    
    public List<Membership> findByUser(User user)
    {
        evictClassEntities();
        QMembership membership = QMembership.membership;
        JPAQueryFactory qf = new JPAQueryFactory(em);
        List<Membership> found = qf.select(membership)
                .from(membership)
                .where(membership.user.eq(user))
                .fetch();
        return found;
    }
}
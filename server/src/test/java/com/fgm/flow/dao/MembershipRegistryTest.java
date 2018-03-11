/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.dao;

import com.fgm.flow.core.Membership;
import com.fgm.flow.core.User;
import com.fgm.flow.core.UserGroup;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import org.junit.AfterClass;
import static org.junit.Assert.assertTrue;
import org.junit.BeforeClass;
import org.junit.Test;


/**
 *
 * A starting point for more extensive testing of MembershipRegistry
 * 
 * 
 * @author fgm
 */
public class MembershipRegistryTest
{

    static MembershipRegistry membershipReg;
    static UserRegistry userReg;
    static UserGroupRegistry uGroupReg;
    static EntityManager em;
  
    @BeforeClass
    public static void setUpClass()
    {
        EntityManagerFactory emf = Persistence.createEntityManagerFactory("flow_pu_test");
        em = emf.createEntityManager();
        membershipReg = new MembershipRegistry();
        userReg = new UserRegistry();
        uGroupReg = new UserGroupRegistry();
        membershipReg.setEntityManager(em);
        userReg.setEntityManager(em);
        uGroupReg.setEntityManager(em);
    }
    
    @AfterClass
    public static void tearDownClass()
    {
        em.close();
    }

    @Test
    public void testCreateMembershipForUserCheckUserIsIn() throws Exception
    {
        em.getTransaction().begin();
        
        User testUser = new User("¤testEmail@test", "¤testNick", "¤testPass");
        userReg.create(testUser);
  
        UserGroup testGroup = new UserGroup("¤testGroup");
        uGroupReg.create(testGroup);
        
        Membership testMembership = new Membership(testUser, testGroup, 0);
        membershipReg.create(testMembership);
        
        assertTrue(
                membershipReg.find(testMembership.getId()).getUser().equals(testUser)
        );
        
        em.getTransaction().rollback();
    }
    
}

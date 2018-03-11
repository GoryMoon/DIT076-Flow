/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.rest;

import com.fgm.flow.core.User;
import com.fgm.flow.core.UserGroup;
import com.fgm.flow.core.Membership;
import com.fgm.flow.dao.UserRegistry;
import com.fgm.flow.dao.UserGroupRegistry;
import com.fgm.flow.dao.MembershipRegistry;
import static com.fgm.flow.service.TestingStatusSupplier.TESTING_DISABLED;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.net.URI;
import java.util.List;
import javax.ejb.EJB;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.Produces;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import static javax.ws.rs.core.Response.Status.GONE;

/**
 *
 * Handles membership test requests
 * 
 * @author fgm
 * 
 */
@Path("membership")
public class MembershipResource
{
    @Context
    private UriInfo uriInfo;

    @EJB
    private UserRegistry userReg;
    @EJB
    private UserGroupRegistry uGroupReg;
    @EJB
    private MembershipRegistry memshipReg;
    private final Gson gson = new Gson();
    
    GsonBuilder gb = new GsonBuilder();
    Gson gsonEWE = gb.excludeFieldsWithoutExposeAnnotation().create();
    
    @POST
    @Path("create")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    public Response create(
            @FormParam("userId") int userId,
            @FormParam("userGroupId") int userGroupId
    ) 
    {
        if(TESTING_DISABLED)
        {
            return Response.status(GONE).build();
        }
        
        
        User user = userReg.find(userId);
        UserGroup userGroup = uGroupReg.find(userId);
        
        if(user != null && userGroup != null)
        {   
            Membership membership = 
                    new Membership(user, userGroup, 0);

            memshipReg.create(membership);

            //poster.addUserGroup(userGroup);
        
            URI postUri = uriInfo
                    .getAbsolutePathBuilder()
                    .path(String.valueOf(membership.getId()))
                    .build(membership);
            
            return Response.created(postUri).build();

        }
        
        return Response.status(403).build();
        
    }
    
    
    @POST
    @Path("invite")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    public Response invite(
            @FormParam("ownerId") int ownerId,
            @FormParam("userGroupId") int userGroupId,
            @FormParam("inviteeId") int inviteeId
        ) 
    {
        if(TESTING_DISABLED)
        {
            return Response.status(GONE).build();
        }
        
        User owner = userReg.find(ownerId);
        User invitee = userReg.find(inviteeId);
        UserGroup userGroup = uGroupReg.find(userGroupId);
        // Check if owner, invitee and user group exist
        if(owner == null || invitee == null || userGroup == null)
        {
            // Return bad request 400 if owner or invitee does not exist
            return Response.status(400).build();
        }      

        // Return forbidden 403 if owner isn't actually owner of the user group
        if(!owner.isOwnerOfGroup(userGroup))
        {
            return Response.status(403).build();
        }
        
        // Return forbidden 403 if invitee already has a membership status in
        // the group
        if(invitee.isMemberOfGroup(userGroup))
        {
            return Response.status(403).build();
        }

        // Create membership for invitee and the user group with status 2, invited
        Membership membership = new Membership(invitee, userGroup, 2);
        memshipReg.create(membership);
        
        URI postUri = uriInfo
                .getAbsolutePathBuilder()
                .path(String.valueOf(membership.getId()))
                .build(membership);

        return Response.created(postUri).build();
    }
    
    @POST
    @Path("join")
    @Consumes({MediaType.APPLICATION_FORM_URLENCODED})
    public Response invite(
            @FormParam("joinerId") int joinerId,
            @FormParam("userGroupId") int userGroupId
        ) 
    {
        if(TESTING_DISABLED)
        {
            return Response.status(GONE).build();
        }
        
        User joiner = userReg.find(joinerId);
        UserGroup userGroup = uGroupReg.find(userGroupId);
        // Check if joiner, invitee and user group exist
        if(joiner == null || userGroup == null)
        {
            // Return bad request 400 if owner or invitee does not exist
            return Response.status(400).build();
        }      

        // Return forbidden 403 if joiner doesn't have the status invited
        // for the group
        if(!joiner.isInvitedToGroup(userGroup))
        {
            return Response.status(403).build();
        }

        // Update membership for joiner and the user group to status 1, active member
        Membership membership = new Membership(joiner, userGroup, 1);
        memshipReg.update(membership);
        
        URI postUri = uriInfo
                .getAbsolutePathBuilder()
                .path(String.valueOf(membership.getId()))
                .build(membership);

        return Response.created(postUri).build();
    }
    
    
   
    
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public Response findAll()
    {   
        if(TESTING_DISABLED)
        {
            return Response.status(GONE).build();
        }
        
        List<Membership> memberships = memshipReg.findAll();
        
        return Response.ok(gson.toJson(memberships)).build();
    }
}

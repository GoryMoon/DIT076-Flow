/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.fgm.flow.rest;

import com.fgm.flow.core.Comment;
import java.io.Serializable;
import java.util.Date;

/**
 * ResponseComment is the proper format for comment data required by the client.
 * 
 * @author fmg
 */
public class ResponseComment implements Serializable
{
    private final int id;
    private final String nick;
    private final String text;
    private final int status;
    private final Date time;
    
    public ResponseComment(Comment comment)
    {
        this.id = comment.getId();
        this.nick = comment.getCommenter().getNick();
        this.text = comment.getText();
        this.status = comment.getStatus();
        this.time = comment.getTime();
    }
}
